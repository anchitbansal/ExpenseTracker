const { getDb } = require("../../config/db");
const lib = require("../../utils/index.utils");

exports.expensesList = async (req, res) =>
{
    let db = null;

    try
    {
        const user_id = req.user.userId;

        if (!user_id)
        {
            lib.throwError(
                'E401',
                'Invalid user session'
            );
        }

        /* ================= REQUEST DATA ================= */

        const payload = req.body.data || {};

        const page_no = payload.page_no || 1;
        const filters = payload.filters || {};

        const {
            exp_by,
            category_id,
            sub_category_id,
            pay_type,
            from_date,
            to_date
        } = filters;

        const page = Number(page_no);
        const limit = 50;
        const offset = (page - 1) * limit;

        /* ================= VALIDATE DATE RANGE ================= */

        if (from_date)
        {
            lib.validateDate(from_date);
        }

        if (to_date)
        {
            lib.validateDate(to_date);
        }

        if (from_date && to_date)
        {
            const from = new Date(from_date);
            const to = new Date(to_date);

            if (from > to)
            {
                lib.throwError(
                    'E201',
                    'from_date cannot be greater than to_date'
                );
            }
        }

        db = await getDb(req);

        /* ================= BUILD FILTER ================= */

        let where = `WHERE ue.user_id = ?`;
        const params = [user_id];

        /* ---------- EXPENSE BY ---------- */

        if (exp_by)
        {
            where += ` AND ue.exp_by = ?`;
            params.push(exp_by);
        }

        /* ---------- CATEGORY ---------- */

        if (category_id)
        {
            where += ` AND ue.category_id = ?`;
            params.push(Number(category_id));
        }

        /* ---------- SUB CATEGORY ---------- */

        if (sub_category_id)
        {
            where += ` AND ue.sub_category_id = ?`;
            params.push(Number(sub_category_id));
        }

        /* ---------- PAYMENT TYPE ---------- */

        if (pay_type)
        {
            where += ` AND ue.pay_type = ?`;
            params.push(pay_type);
        }

        /* ---------- FROM DATE ---------- */

        if (from_date)
        {
            where += ` AND ue.exp_date >= ?`;
            params.push(from_date);
        }

        /* ---------- TO DATE ---------- */

        if (to_date)
        {
            where += ` AND ue.exp_date <= ?`;
            params.push(to_date);
        }

        /* ================= GET TOTAL ================= */

        const countResult = await db.query(
            `
            SELECT COUNT(*) AS total
            FROM users_expenses ue
            ${where}
            `,
            params
        );

        const total = Number(countResult[0].total);

        /* ================= GET EXPENSES ================= */

        const expenses = await db.query(
            `
            SELECT
                ue.id,
                ue.exp_by,
                ue.amount,
                ec.name AS category,
                esc.name AS sub_category,
                ue.pay_type,
                ue.exp_date,
                ue.description
            FROM users_expenses ue
            LEFT JOIN exp_categories ec
                ON ec.id = ue.category_id
            LEFT JOIN exp_sub_categories esc
                ON esc.id = ue.sub_category_id
            ${where}
            ORDER BY ue.exp_date DESC, ue.id DESC
            LIMIT ? OFFSET ?
            `,
            [
                ...params,
                limit,
                offset
            ]
        );

        /* ================= PAGINATION ================= */

        const totalPages = Math.ceil(total / limit);

        /* ================= SUCCESS RESPONSE ================= */

        return lib.SuccessResponse(
            req,
            res,
            {
                status: '0000',
                message: 'Expenses fetched successfully',
                data:
                {
                    expenses,
                    pagination:
                    {
                        page_no: page,
                        per_page: limit,
                        total_records: total,
                        total_pages: totalPages
                    }
                }
            }
        );
    }
    catch (err)
    {
        lib.ErrorResponse(req, res, err);
    }
    finally
    {
        if (db)
        {
            await db.close();
        }
    }
};
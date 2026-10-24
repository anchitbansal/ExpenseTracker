const { getDb } = require("../../config/db");
const lib = require("../../utils/index.utils");

exports.expenseDashboard = async (req, res) =>
{
    let db = null;

    try
    {
        /* ================= GET AUTHENTICATED USER ================= */

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

        const {
            from_date,
            to_date
        } = payload;

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

        /* ================= CREATE DB CONNECTION ================= */

        db = await getDb(req);

        /* ================= BUILD WHERE CLAUSE ================= */

        let where = `WHERE ue.user_id = ?`;
        const params = [user_id];

        if (from_date)
        {
            where += ` AND ue.exp_date >= ?`;
            params.push(from_date);
        }

        if (to_date)
        {
            where += ` AND ue.exp_date <= ?`;
            params.push(to_date);
        }

        /* ================= 1. TOTAL SPENT & TRANSACTION COUNT ================= */

        const summaryResult = await db.query(
            `
            SELECT
                COALESCE(SUM(ue.amount), 0) AS total_spent,
                COUNT(*) AS total_transactions
            FROM users_expenses ue
            ${where}
            `,
            params
        );

        const total_spent = Number(summaryResult[0].total_spent);
        const total_transactions = Number(
            summaryResult[0].total_transactions
        );

        /* ================= 2. SPENDING BY CATEGORY ================= */

        const categorySummary = await db.query(
            `
            SELECT
                ec.id AS category_id,
                COALESCE(ec.name, 'Uncategorized') AS category_name,
                COALESCE(SUM(ue.amount), 0) AS total_amount,
                COUNT(ue.id) AS transaction_count
            FROM users_expenses ue
            LEFT JOIN exp_categories ec
                ON ec.id = ue.category_id
            ${where}
            GROUP BY ue.category_id, ec.name
            ORDER BY total_amount DESC
            `,
            params
        );

        /* ================= 3. SPENDING BY PAYMENT TYPE ================= */

        const payTypeSummary = await db.query(
            `
            SELECT
                ue.pay_type,
                COALESCE(SUM(ue.amount), 0) AS total_amount,
                COUNT(ue.id) AS transaction_count
            FROM users_expenses ue
            ${where}
            GROUP BY ue.pay_type
            ORDER BY total_amount DESC
            `,
            params
        );

        /* ================= 4. SPENDING BY PERSON (EXP_BY) ================= */

        const expBySummary = await db.query(
            `
            SELECT
                ue.exp_by,
                COALESCE(SUM(ue.amount), 0) AS total_amount,
                COUNT(ue.id) AS transaction_count
            FROM users_expenses ue
            ${where}
            GROUP BY ue.exp_by
            ORDER BY total_amount DESC
            `,
            params
        );

        /* ================= SUCCESS RESPONSE ================= */

        return lib.SuccessResponse(
            req,
            res,
            {
                status: '0000',
                message: 'Dashboard data fetched successfully',
                data:
                {
                    summary:
                    {
                        total_spent,
                        total_transactions
                    },
                    by_category: categorySummary,
                    by_pay_type: payTypeSummary,
                    by_exp_by: expBySummary
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
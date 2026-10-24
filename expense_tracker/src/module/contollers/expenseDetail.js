const { getDb } = require("../../config/db");
const lib = require("../../utils/index.utils");

exports.expenseDetail = async (req, res) =>
{
    let db = null;

    try
    {
        const payload = req.body.data || {};

        const missingField = lib.validateRequiredParameters(
            payload,
            ['expense_id']
        );

        if(missingField.length > 0)
        {
            lib.throwError(
                "EM001",
                "Expense ID is required"
            );
        }

        const { expense_id } = payload;

        const user_id = req.user.userId;

        if (!user_id)
        {
            lib.throwError(
                'E401',
                'Invalid user session'
            );
        }

        db = await getDb(req);

        /* ================= GET EXPENSE DETAIL ================= */

        const expenses = await db.query(
            `
            SELECT
                ue.id AS expense_id,
                ue.exp_by,
                ue.amount,
                ec.name AS category,
                esc.name AS sub_category,
                ue.pay_type,
                ue.exp_date,
                ue.description,
                ue.created_at
            FROM users_expenses ue
            LEFT JOIN exp_categories ec
                ON ec.id = ue.category_id
            LEFT JOIN exp_sub_categories esc
                ON esc.id = ue.sub_category_id
            WHERE ue.id = ?
            AND ue.user_id = ?
            LIMIT 1
            `,
            [
                Number(expense_id),
                user_id
            ]
        );

        /* ================= EXPENSE NOT FOUND ================= */

        if(expenses.length === 0)
        {
            lib.throwError(
                'E404',
                'Expense not found'
            );
        }

        /* ================= SUCCESS RESPONSE ================= */

        return lib.SuccessResponse(
            req,
            res,
            {
                status: '0000',
                message: 'Expense detail fetched successfully',
                data: expenses[0]
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
const { getDb } = require("../../config/db");
const lib = require("../../utils/index.utils");

exports.updateExpense = async (req, res) =>
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

        /* ================= VALIDATE REQUIRED PARAMETERS ================= */

        const missingField = lib.validateRequiredParameters(
            payload,
            [
                'expense_id',
                'exp_by',
                'amount',
                'category_id',
                'sub_category_id',
                'pay_type',
                'exp_date'
            ]
        );

        if (missingField.length > 0)
        {
            lib.throwError(
                'EM001',
                'Some details are missing'
            );
        }

        const {
            expense_id,
            exp_by,
            category_id,
            sub_category_id,
            pay_type,
            exp_date,
            description
        } = payload;

        /* ================= VALIDATE AMOUNT ================= */

        const amount = lib.validateAmount(payload.amount);

        /* ================= VALIDATE EXPENSE DATE ================= */

        lib.validateDate(exp_date);

        /* ================= CREATE DB CONNECTION ================= */

        db = await getDb(req);

        /* ================= CHECK EXPENSE ================= */

        const existingExpense = await db.query(
            `
            SELECT id
            FROM users_expenses
            WHERE id = ? AND user_id = ?
            `,
            [
                Number(expense_id),
                user_id
            ]
        );

        if (existingExpense.length === 0)
        {
            lib.throwError(
                'E404',
                'Expense not found'
            );
        }

        /* ================= UPDATE EXPENSE ================= */

        const updateExpense = await db.query(
            `
            UPDATE users_expenses
            SET
                exp_by = ?,
                amount = ?,
                category_id = ?,
                sub_category_id = ?,
                pay_type = ?,
                exp_date = ?,
                description = ?
            WHERE id = ? AND user_id = ?
            `,
            [
                exp_by,
                amount,
                Number(category_id),
                Number(sub_category_id),
                pay_type,
                exp_date,
                description || null,
                Number(expense_id),
                user_id
            ]
        );

        if (updateExpense.affectedRows === 0)
        {
            lib.throwError(
                'E404',
                'Unable to update expense'
            );
        }

        /* ================= SUCCESS RESPONSE ================= */

        return lib.SuccessResponse(
            req,
            res,
            {
                status: '0000',
                message: 'Expense updated successfully',
                data:
                {
                    expense_id: Number(expense_id)
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
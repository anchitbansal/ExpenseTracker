const { getDb } = require("../../config/db");
const lib = require("../../utils/index.utils");

exports.deleteExpense = async (req, res) =>
{
    let db = null;

    try
    {
        const user_id = req.user.userId;
        const payload = req.body.data || {};

        const missingField = lib.validateRequiredParameters(
            payload,
            ['expense_id']
        );

        if(missingField.length > 0){
            lib.throwError("EM001", "Expense ID is required");
        }

        const { expense_id } = payload;

        db = await getDb(req);

        const expenses = await db.query(
            "SELECT id FROM users_expenses WHERE id = ? AND user_id = ?",
            [
                expense_id,
                user_id
            ]
        );

        if(expenses.length === 0)
        {
            lib.throwError(
                'E404',
                'Expense not found'
            );
        }

        const deleteExpense = await db.query(
            "DELETE FROM users_expenses WHERE id = ? AND user_id = ?",
            [
                Number(expense_id),
                user_id
            ]
        );

        if(deleteExpense.affectedRows === 0)
        {
            lib.throwError(
                'E404',
                'Unable to delete expense'
            );
        }

        return lib.SuccessResponse(
            req,
            res,
            {
                status: '0000',
                message: 'Expense deleted successfully',
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
const { getDb } = require("../../config/db");
const lib = require("../../utils/index.utils");

exports.addExpense = async (req, res) =>
{
    let db = null;

    try
    {
        const payload = req.body.data;

        const missingField = lib.validateRequiredParameters(
            payload,
            [
                'exp_by',
                'amount',
                'category_id',
                'sub_category_id',
                'pay_type',
                'exp_date'
            ]
        );

        if(missingField.length > 0){
            lib.throwError("EM001", "Some details are missing");
        }

        const {
            exp_by,
            category_id,
            sub_category_id,
            pay_type,
            exp_date,
            description
        } = payload;

        const amount = lib.validateAmount(payload.amount);

        lib.validateDate(exp_date);

        const user_id = req.user.userId;

        if (!user_id)
        {
            lib.throwError(
                'E401',
                'Invalid user session, Please Login Again'
            );
        }

        db = await getDb(req);

        const data = {
            user_id: user_id,
            exp_by: exp_by,
            amount: amount,
            category_id: category_id,
            sub_category_id: sub_category_id,
            pay_type: pay_type,
            exp_date: exp_date,
            description: description || null
        };

        const expenseInsertResult = await db.query(
            "INSERT INTO users_expenses SET ?",
            data
        );

        const expense_id = expenseInsertResult.insertId;

        return lib.SuccessResponse(
            req,
            res,
            {
                status: '0000',
                message: 'Expense added successfully',
                data: {
                    expense_id: expense_id
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
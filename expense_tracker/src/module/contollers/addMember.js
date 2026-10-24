const { getDb } = require("../../config/db");
const lib = require("../../utils/index.utils");

exports.addMember = async (req, res) =>
{
    let db = null;

    try
    {

        const payload = req.body.data;

        const missingField = lib.validateRequiredParameters(payload,['member_name','relation']);
        if(missingField.length > 0){
            lib.throwError("EM001", "Enter atleast 1 Member");
        }

        const { member_name, relation } = payload;

        const user_id = req.user.userId;

        if (!user_id)
        {
            lib.throwError(
                'E401',
                'Invalid user session, Please Login Agian'
            );
        }

        db = await getDb(req);

        const data = {
            user_id: user_id,
            member_name: member_name,
            status: 1,
            relation: relation
        }
        const sql1 = await db.query("insert into members set ?", data);

        lib.SuccessResponse(
            req,
            res,
            {
                status: '0000',
                message: 'Member added successfully',
                data:
                {
                    mid: sql1.insertId
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
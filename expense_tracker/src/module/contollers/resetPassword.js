const {getDb} = require("../../config/db");
const lib = require("../../utils/index.utils");


exports.resetPassword = async(req, res) =>
{
    let db = null;
    try
    {
        const payload = req.body.data;
        const {email, newPassword} = payload;

        db = await getDb(req);

        const sql1 = await db.query("select email,password from user where email = ?", [email]);
        if(sql1.length == 0)
        {
            return lib.throwError("E001","Email is not registered");
        };

        const user_details = sql1[0];
        

        const hashedpassword = await lib.doHash(newPassword);

        const comparePassword = await lib.compareHash(newPassword, user_details.password)

        if (comparePassword)
        {
            return lib.throwError("E003","Your Password should not be same with Previous one");
        }

        const sql2 = await db.query("update user set password = ? where email = ?", [hashedpassword, email]);

        return lib.SuccessResponse(req, res, {
            status: "0000",
            message: "Your Password is Changed Successfully",
            data: {
                email: email
            }
        })

    }
    catch(err)
    {
        console.log(err);
        return lib.ErrorResponse(req, res, err)
    }
    finally{
        if(db) await db.close();
    }
}
const {getDb} = require("../../config/db");
const lib = require("../../utils/index.utils");
const bcrypt = require("bcrypt")

exports.deleteUser = async (req, res) => 
{
    let db = null;
    try
    {
        const payload = req.body.data;
        const {email, password} = payload;

        db = await getDb(req);
        
        const query = await db.query("select email, password from user where email = ?", [email]);
        

        if(query.length === 0){
            lib.throwError("EC01", "Invalid email or password.");
        }

        const user_details = query[0];


        const compareHash = await bcrypt.compare(password, user_details.password);

        if(!compareHash){
            return lib.throwError("EC02", "Invalid email or password.");
        }


        const query2 = await db.query(
            `
            UPDATE user
            SET
                email = CONCAT(email, '$$'),
                mobile = CONCAT(mobile, '$$'),
                is_deleted = 1
            WHERE email = ?
            `,
            [
                email
            ]
        );

        if(query2.affectedRows == 0){
            
            lib.throwError("ED001", "Unable to Delete User")
        }

       

        return res.json({
            status: "0000",
            message: " User deleted successfully."
        });

    }
    
    catch(err)
    {
       
        lib.ErrorResponse(req, res, err);
    }

    finally{
        if (db) await db.close();
    }

}
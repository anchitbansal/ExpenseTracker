//profile.js

const { get } = require("../../config/app");
const { getDb } = require("../../config/db");
const lib = require("../../utils/index.utils");

exports.user_profile = async (req, res) => 
{
    let db = null;
    try
    {

        db = await getDb(req);

        const user = await db.query("select * from user where user_id = ?",[req.user.userId])

        const detail = user[0]


        lib.SuccessResponse(req, res, {
            status: "0000",
            message: "Profile fetched.",
            data: {
                userId: req.user.userId,
                email: req.user.email,
                name: detail.name,
                mobile: detail.mobile,
            	profile_picture : detail.profile_picture,
            	created_at : detail.created_at
            }
        });
    } catch (err){
        lib.ErrorResponse(req, res, err);
    }
    finally{
        if(db) await db.close();
    }
}
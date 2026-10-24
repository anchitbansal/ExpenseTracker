const { getDb } = require("../../config/db");
const jwtAuth = require("jsonwebtoken");
const lib = require("../../utils/index.utils");

exports.login = async (req, res) => 
{
    let db = null;
    try 
    {
        const header_details = req.headers;
        const device_id = req.headers["device-id"];
        const device_name = req.headers["device-name"];
        const device_type = req.headers["device-type"];
        const device_token = req.headers["device-token"];
        const device_version = req.headers["device-version"];
        const missingHeader = lib.validateRequiredParameters(header_details, ["device-id", "device-name", "device-type", "device-token", "device-version"]);
        if (missingHeader.length > 0) lib.throwError("EV001", "Device Details are missing");

    	const payload = req.body.data;
    	const { email, password } = req.body.data;
        const missingFields = lib.validateRequiredParameters(payload, ["email", "password"]);
        if (missingFields.length > 0) lib.throwError("EV002", "Some Fields are missing");
    
        db = await getDb(req);

        const result = await db.query("select user_id, email, password, is_email_verified, display_name from user where email = ?;", [email]);

        if (result.length == 0) 
            lib.throwError("E001", "Invalid email or password.");
        

        const user_details = result[0];

        const compare_hashed = await lib.compareHash(password, user_details.password);

        if (!compare_hashed) 
            lib.throwError("E002", "Invalid email or password");
      
        if (user_details.is_email_verified == 0) 
        {
            await lib.sendRegistrationEmail(user_details.user_id, user_details.email, user_details.name);
        	lib.throwError("EV05", "Your Email is not Verified, A link is SENT on your Email, Please verify to login.");
        }

        const device_info = {
            device_id: device_id,
            device_name: device_name,
            device_type: device_type,
            device_token: device_token,
            device_version: device_version
        };
        await lib.insertOrUpdateDevice(db, user_details.user_id, device_info);

        const token = jwtAuth.sign(
            { userId: user_details.user_id, email: user_details.email },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        return lib.SuccessResponse(req, res, {
            status: "0000",
            message: "Login succesfull",
            data: {
                
                    userId: user_details.user_id,
                    email: user_details.email,
                    token: token
                
            }
        });

    } catch (err) {
        console.log(err);
        lib.ErrorResponse(req, res, err);
    } finally {
        if (db) {
            await db.close();
        }
    }
};
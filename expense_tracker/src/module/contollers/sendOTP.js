const lib = require("../../utils/index.utils");
const { getDb } = require("../../config/db");
const crypto = require("crypto");

exports.sendOtp = async (req, res) => {
    let db = null;
    try {
        const payload = req.body.data;
        const { email, mobile } = payload;

        db = await getDb(req);

        const sql1 = await db.query(
            "select user_id, email, mobile, display_name from user where email = ? OR mobile = ?", 
            [email, mobile]
        );
        
        if (sql1.length === 0) {
            lib.throwError("E001", "User is not Registered");
        }

        const userDetails = sql1[0];

        const otp = crypto.randomInt(100000, 1000000);

        const expiryTime = Date.now() + 10 * 60 * 1000;

        const hashOtp = await lib.doHash(otp.toString());

        await lib.sendOtpEmail(email, otp, userDetails.display_name || "User");

        return lib.SuccessResponse(req, res, {
            status: "0000",
            message: "OTP sent to your Registered Email Id",
            data: {
                email: email,
                otp: hashOtp,
                otpExpiresAt: expiryTime
            }
        });

    } catch (err) {
        console.log(err);
        await lib.ErrorResponse(req, res, err);
    } finally {
        if (db) await db.close();
    }
};
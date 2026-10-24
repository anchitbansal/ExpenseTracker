// register.js

require("dotenv").config();
const { getDb } = require("../../config/db");
const lib = require("../../utils/index.utils");
const jwt = require("jsonwebtoken");


exports.signup = async (req, res) => {
  let db = null;
  let transactionStarted = false;

  try 
  {
    const header_details = req.headers || {};
    const device_id = header_details["device-id"];
    const device_name = header_details["device-name"];
    const device_type = header_details["device-type"];
    const device_token = header_details["device-token"];
    const device_version = header_details["device-version"];
  
    const missingHeader = lib.validateRequiredParameters(header_details, [
      "device-id",
      "device-name",
      "device-type",
      "device-token",
      "device-version"
    ]);
    if (missingHeader.length > 0) lib.throwError("EV001", "Device Details are missing");
  
  
  	const payload = req.body?.data || {};
    const { display_name, email, password, mobile } = payload;
	const missingFields = lib.validateRequiredParameters(payload, ["display_name", "email", "mobile", "password"]);
    if (missingFields.length > 0) lib.throwError("EV002", "Some Fields are missing");

  	
    if (!lib.emailValidation(email)) lib.throwError("EV003", "Invalid Email");
    if (!lib.mobileValidation(mobile)) lib.throwError("EV004", "Invalid Mobile Number");
    if (!lib.passwordValidation(password)) {
      lib.throwError("EV005", "Password must contain at least 1 Upper Case, 1 Lower Case, 1 number, and 1 Special Character");
    }

    db = await getDb(req);

    const existingUsers = await db.query(
      "SELECT user_id, email, mobile, is_email_verified FROM user WHERE email = ? OR mobile = ?",
      [email, mobile]
    );

    if (existingUsers.length > 0) 
    {
      	const user = existingUsers[0];
      	const userId = user.user_id;
		if (user.email === email) lib.throwError("ER01", "Email is already registered");
        if (user.mobile === mobile) lib.throwError("ER02", "Mobile is already registered");
    }

    await db.startTrans();
    transactionStarted = true;

    const hashPassword = await lib.doHash(password);

    const userData = {
      display_name,
      email: email,
      password: hashPassword,
      mobile: mobile,
      is_email_verified: 0
    };

    const userInsertResult = await db.query("INSERT INTO user SET ?", userData);
    const newUserId = userInsertResult.insertId;

    const device_info = {
      device_id: device_id,
      device_name: device_name,
      device_type: device_type,
      device_token: device_token,
      device_version: device_version
    };
  	await lib.insertOrUpdateDevice(db, newUserId, device_info);

    await lib.sendRegistrationEmail(newUserId, email, display_name);

    await db.commitTrans();
    transactionStarted = false;

    return lib.SuccessResponse(req, res, {
      status: "0000",
      message: "Registration successful. A verification email has been sent to your registered mail ID."
    });

  } catch (err) {
    console.error(`ORIGINAL ERROR :::`, err);

    if (db && transactionStarted) {
      try {
        await db.rollBackTrans();
      } catch (rollbackerr) {
        console.error("Rollback failed or transaction not active:", rollbackerr.message || rollbackerr);
      }
    }

    return lib.ErrorResponse(req, res, err);

  } finally {
    if (db) {
      await db.close();
    }
  }
};



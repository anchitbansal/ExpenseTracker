const { getDb } = require("../config/db");
const lib = require("../utils/index.utils");

exports.deviceAuth = async (req, res, next) => {
    let db = null;
    try{
        const {userId, email} = req.user;
    
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
    	if (missingHeader.length > 0) lib.throwError("EV001", "Device Details are missing.");
  
		const device_info = {
    		device_id,
    		device_name,
    		device_type,
    		device_token,
    		device_version
		};

		db = await getDb(req);

		await lib.insertOrUpdateDevice(db, userId, device_info);

        next();

    }
    catch(err){
        console.log(err);
        lib.ErrorResponse(req, res, err);
    }
    finally{
        if(db){
            await db.close();
        }
    }
}


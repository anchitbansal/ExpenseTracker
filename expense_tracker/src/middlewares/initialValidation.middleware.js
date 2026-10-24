const lib = require("../utils/index.utils")

// exports.initialValidation = (req, res, next) =>
// {
//     try
//     {
//         const payload = req.body;
//         if(req.is("application/json")){
//         const missing = lib.validateRequiredParameters(payload, ["api", "timestamp", "data"])
//         if(missing.length > 0) lib.throwError("EM001", "api or timestamp or data is Missing");
//         }
//         else if (req.is("multipart/form-data")){
//         const missing = lib.validateRequiredParameters(payload,["api", "timestamp"]);
//         if(missing.length > 0) lib.throwError("EM002", "api or timestamp Missing");
//         }
//         else{
//         lib.throwError("", "something went wrong")
//         }
//         next();
//     }
//     catch(err)
//     {
//         lib.ErrorResponse(req, res, err);
//     }
// }


// const lib = require("../utils/index.utils");

// exports.initialValidation = (req, res, next) => {
//   try {
//     const payload = {
//       ...req.body,
//       api: req.body?.api || req.headers["api"],
//       timestamp: req.body?.timestamp || req.headers["timestamp"],
//     };
    

//     if (req.is("application/json")) {
//       const missing = lib.validateRequiredParameters(payload, ["api", "timestamp", "data"]);
//       if (missing.length > 0) lib.throwError("EM001", "api or timestamp or data is Missing");
//     } else if (req.is("multipart/form-data")) {
//       const missing = lib.validateRequiredParameters(payload, ["api", "timestamp"]);
//       if (missing.length > 0) lib.throwError("EM002", "api or timestamp Missing");
//     } else {
//       lib.throwError("EM003", "something went wrong");
//     }

//     next();
//   } catch (err) {
//     lib.ErrorResponse(req, res, err);
//   }
// };




exports.initialValidation = (req, res, next) => {
    try {

        //console.log("CONTENT TYPE :::", req.headers["content-type"]);
        //console.log("IS MULTIPART :::", req.is("multipart/form-data"));
        //console.log("FILES IN INITIAL :::", req.files);
        //console.log("BODY IN INITIAL :::", req.body);

        const payload = req.body;
    	
		console.log(payload)
        if(req.is("application/json")) {
            const missing = lib.validateRequiredParameters(
                payload,
                ["api", "timestamp", "data"]
            );

            if(missing.length > 0)
                lib.throwError("EM002", "api or timestamp or data is Missing");

        }
        else if(req.is("multipart/form-data")) {

            const missing = lib.validateRequiredParameters(
                payload,
                ["api", "timestamp"]
            );

            if(missing.length > 0)
                lib.throwError("EM002", "api or timestamp Missing");

        }
        

        next();

    }
    catch(err) {
        lib.ErrorResponse(req, res, err);        lib.ErrorResponse(req, res, err);

    }
}
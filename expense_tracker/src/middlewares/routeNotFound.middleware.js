const lib = require("../utils/index.utils");

const routeNotFound = (req, res, next) => 
{
    const err = new Error("API route not found");
    err.httpStatus = 404;
    err.status = "E404";
    err.path = req.originalUrl;
    lib.ErrorResponse(req, res, err);

};

module.exports = {routeNotFound};

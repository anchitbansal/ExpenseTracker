require("dotenv").config()
const { getDb } = require("../config/db")
const lib = require("../utils/index.utils")

// const jwtAuth = require("jsonwebtoken");

exports.jwtmiddleware = async (req, res, next) => 
{
    try{
        const authHeader = req.headers.authorization;
        if (!authHeader){
            lib.throwError("EA01", "Autherization Header Missing")
        }

        const auth_token = authHeader.split(" ")[1];
        if (!auth_token){
            lib.throwError("EA02", "Authorization Token Missing")
        }

        // const decoded = jwtAuth.verify(auth_token, process.env.JWT_SECRET);
        const decoded = await lib.verifyJwt(auth_token);
        if(!decoded) lib.throwError("EM001", "Access Denied.");


        req.user = decoded;   // userId, email
        //console.log("req.user  ::::  ",req.user)

        next();

    }
	catch (err)
    {
        console.log(err)
        lib.ErrorResponse(req, res, err);

    }
}
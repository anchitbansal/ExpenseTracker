require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const doHash = async(plainPassword) => 
{
    return bcrypt.hash(plainPassword.toString(), 12);
}

const compareHash = async (plainPassword, hashedPassword) =>
{
    return bcrypt.compare(plainPassword, hashedPassword);
}

// const createJwt = async (userId, email) => 
// {
//     const token = jwt.sign({ userId : userId, email: email}, process.env.JWT_SECRET, {expiresIn: "1h"});
//     if(!token)
//     {
//         console.log("Jwt Token Creation Error");
//         return false;
//     }
//     return token;
// }

const verifyJwt = async(auth_token)=>
{
	let decoded = null;
	try{
    decoded = jwt.verify(auth_token, process.env.JWT_SECRET);
    }
	catch(err)
    {
        return false;	
    }
    return decoded;
}

module.exports = 
{
    doHash,
    compareHash,
    // createJwt,
    verifyJwt
}
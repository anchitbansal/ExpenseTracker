// validation.utils.js

const {throwError} = require("./core.utils")


const validateRequiredParameters = (payload = {}, requiredDetails = []) => 
{
    const missing = requiredDetails.filter(
        (fieldname) => {
           if (payload[fieldname] === undefined || payload[fieldname] === null || payload[fieldname] ===""){
            return true;
           }
           return false;
        }
        
    )
    return missing;
}
    // if(missing.length > 0){
    //     return throwError("EV01", "Some Detail are missing")
    // }

    // return missing;
//}



const emailValidation = (email) => 
{
    let result = true;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if(!regex.test(email)){
        //throwError("EV02", "Invalid Email")
        result = false;
    }
    return result;
}


const mobileValidation = (payload) => 
{
    let result = true;
    const regex = /^\+?[0-9]{10,15}$/
    if(!regex.test(payload)){
        result = false;
    }
    return result;
}


const passwordValidation = (password) =>
{
    let result = true;
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{6,9}$/
    if(!regex.test(password)){
        // throwError("EV04", "Password must Conatin atleast - 1 Upper Case, 1 Lower Case, 1 number , 1 Special Character");
        result = false
    }
    return result;
}




const validateAmount = (amount) =>
{
    if (
        amount === undefined ||
        amount === null ||
        amount === '' ||
        isNaN(amount) ||
        Number(amount) <= 0
    )
    {
        throwError(
            'E004',
            'Invalid amount'
        );
    }

    return Number(amount);
};


const validateDate = (date) =>
{
    if (
        date === undefined ||
        date === null ||
        date === '' ||
        isNaN(new Date(date).getTime())
    )
    {
        throwError(
            'E005',
            'Invalid date'
        );
    }

    return date;
};


module.exports = { 
    validateRequiredParameters,
    emailValidation,
    mobileValidation,
    validateAmount,
    validateDate,
    passwordValidation
 };
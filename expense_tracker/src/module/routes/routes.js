const express = require("express");

const router = express.Router();


const { signup } = require("../contollers/signup");
const { login } = require("../contollers/login");
const { sendOtp } = require("../contollers/sendOTP");
const { resetPassword } = require("../contollers/resetPassword");
const { emailVerification } = require("../contollers/verify_email");
const { user_profile } = require("../contollers/user_profile");
const { deleteUser } = require("../contollers/delete_user");
const { addExpense } = require("../contollers/addExpense");
const { addMember } = require("../contollers/addMember");
const { categoryList } = require("../contollers/categoryList");
const { deleteExpense } = require("../contollers/deleteExpense");

const { deleteMember } = require("../contollers/deleteMember");
const { expenseDashboard } = require("../contollers/expenseDashboard");
const { expenseDetail } = require("../contollers/expenseDetail");
const { memberList } = require("../contollers/memberList");
const { subcategoryList } = require("../contollers/subcategoryList");
const { updateExpense } = require("../contollers/updateExpense");
const { updateMember } = require("../contollers/updateMember");
const { expensesList } = require("../contollers/expensesList");
const { addProfilePicture } = require("../contollers/addProfilePicture");



router.post("/user/signup", signup);
router.post("/user/login", login);

router.post("/user/forgetPassword", sendOtp);
router.post("/user/resetPassword", resetPassword);

router.post("/user/delete", deleteUser);   
router.post('/user/auth/category/list', categoryList);   
router.post('/user/auth/subcategory/list', subcategoryList);  
router.post('/user/auth/expense/add', addExpense);     
router.post('/user/auth/member/add', addMember);    
router.post('/user/auth/member/delete', deleteMember);   
router.post('/user/auth/expenses/list', expensesList);  
router.post('/user/auth/expense/delete', deleteExpense);   
router.post('/user/auth/expense/detail', expenseDetail);   
router.post('/user/auth/expense/dashboard', expenseDashboard);  
router.post('/user/auth/expense/update', updateExpense);  
router.post('/user/auth/member/list', memberList);  
router.post('/user/auth/member/update', updateMember); 

router.post('/user/auth/add/profile/picture', addProfilePicture);  

router.get("/verify-email/user", emailVerification);

router.post("/user/auth/profile", user_profile);


module.exports = router;

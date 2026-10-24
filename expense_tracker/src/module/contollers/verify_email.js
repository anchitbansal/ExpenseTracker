// verify_email.js

const { getDb } = require("../../config/db");
const lib = require("../../utils/index.utils");

exports.emailVerification = async (req, res) => {
    let db = null;
    let message = "";
    let heading = "Email Verification";
    let subheading = "";
    let isSuccess = false;

    try {
        const token = req.query.token;

        // Verify JWT token
        const decoded = await lib.verifyJwt(token);

        if (!decoded) 
        {
            heading = heading + " Failed.";
            subheading = "Verification Failed";
            message = "Invalid or expired verification link. Please request a new verification email.";
            isSuccess = false;
        } 
    	else 
        {
            db = await getDb(req);

            // Check if user exists and is already verified
            const userResult = await db.query(
                `SELECT is_email_verified FROM user WHERE user_id = ?`,
                [decoded.userId]
            );

            if (userResult.length <= 0) 
            {
                heading = heading + " Failed.";
                subheading = "User Not Found";
                message = "The user associated with this verification link does not exist.";
                isSuccess = false;
            } 
        	else if (userResult[0].is_email_verified == "1") 
            {
                subheading = "Already Verified";
                message = "Your email address is already Verified. You can now access your account."; 
                isSuccess = true;
            } else 
            {
                // Update verification status
                await db.query(
                    `UPDATE user SET is_email_verified = ? WHERE user_id = ?`,
                    [1, decoded.userId]
                );

                console.log("Email verified successfully");

                heading = heading + " Successful!";
                subheading = "";
                message = "Your email address has been verified successfully. You can now access your account.";
                isSuccess = true;
            }
        }
    } catch (err) {
        console.error("Verification Error:", err);
        heading = heading + " Failed.";
        subheading = "Internal Server Error";
        message = "An unexpected error occurred during the verification process. Please try again later.";
        isSuccess = false;
    } finally {
        if (db) {
            await db.close();
        }

        // Animated Success SVG Icon
        const successIcon = `
            <div class="icon-circle success-bg">
                <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                    <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>
            </div>
        `;

        // Animated Failed SVG Icon
        const failedIcon = `
            <div class="icon-circle failed-bg">
                <svg class="crossmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle class="crossmark-circle" cx="26" cy="26" r="25" fill="none"/>
                    <path class="crossmark-check" fill="none" d="M16 16 L36 36 M36 16 L16 36"/>
                </svg>
            </div>
        `;

        const response = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${heading}</title>
            <style>
                * {
                    box-sizing: border-box;
                }
                body {
                    background-color: #f4f6f9;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                }
                .card {
                    background: #ffffff;
                    border-radius: 20px;
                    padding: 40px 30px;
                    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.05);
                    width: 100%;
                    max-width: 480px;
                    text-align: center;
                }
                
                /* Header with Plain Centered Logo */
                .brand-header {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 24px;
                }
                .brand-logo {
                    max-width: 300px;
                    height: 65px;
                    object-fit: contain;
                    display: block;
                }

                .heading {
                    font-size: 22px;
                    font-weight: 800;
                    color: ${isSuccess ? "#10b981" : "#ef4444"};
                    margin: 0 0 8px 0;
                    letter-spacing: -0.5px;
                }
                .subheading {
                    font-size: 16px;
                    font-weight: 600;
                    color: #475569;
                    margin: 0 0 20px 0;
                }
                .message {
                    font-size: 14px;
                    color: #64748b;
                    line-height: 1.6;
                    margin: 0 0 24px 0;
                }

                /* Animated Status Icon Container */
                .icon-container {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 24px;
                }
                .icon-circle {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .success-bg {
                    background-color: #e0f2fe;
                }
                .failed-bg {
                    background-color: #fee2e2;
                }

                /* Success Animation */
                .checkmark {
                    width: 52px;
                    height: 52px;
                    border-radius: 50%;
                    display: block;
                    stroke-width: 3;
                    stroke: #10b981;
                    stroke-miterlimit: 10;
                    box-shadow: inset 0px 0px 0px #10b981;
                    animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
                }
                .checkmark-circle {
                    stroke-dasharray: 166;
                    stroke-dashoffset: 166;
                    stroke-width: 3;
                    stroke-miterlimit: 10;
                    stroke: #10b981;
                    fill: none;
                    animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
                }
                .checkmark-check {
                    transform-origin: 50% 50%;
                    stroke-dasharray: 48;
                    stroke-dashoffset: 48;
                    animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
                }

                /* Failure Animation */
                .crossmark {
                    width: 52px;
                    height: 52px;
                    border-radius: 50%;
                    display: block;
                    stroke-width: 3;
                    stroke: #ef4444;
                    stroke-miterlimit: 10;
                    animation: scale .3s ease-in-out .9s both;
                }
                .crossmark-circle {
                    stroke-dasharray: 166;
                    stroke-dashoffset: 166;
                    stroke-width: 3;
                    stroke-miterlimit: 10;
                    stroke: #ef4444;
                    fill: none;
                    animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
                }
                .crossmark-check {
                    transform-origin: 50% 50%;
                    stroke-dasharray: 48;
                    stroke-dashoffset: 48;
                    animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
                }

                @keyframes stroke {
                    100% {
                        stroke-dashoffset: 0;
                    }
                }
                @keyframes scale {
                    0%, 100% {
                        transform: none;
                    }
                    50% {
                        transform: scale3d(1.1, 1.1, 1);
                    }
                }
            </style>
        </head>
        <body>
            <div class="card">
                <div class="brand-header">
                    <img src="${process.env.BASE_URL}/img/logo3.png" alt="Logo" class="brand-logo" onerror="this.style.display='none'" />
                </div>
                
                <div class="icon-container">
                    ${isSuccess ? successIcon : failedIcon}
                </div>

                <h2 class="heading">${heading}</h2>
                <div class="subheading">${subheading}</div>
                <div class="message">${message}</div>
            </div>
        </body>
        </html>`;

        res.setHeader("Content-Type", "text/html");
        return res.send(response);
    }
};
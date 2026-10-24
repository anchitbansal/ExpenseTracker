require("dotenv").config();
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const sendEmail = async (mid, subData, txtData,htmlData,   attachments) =>  
{ 
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // SMTP server host for Gmail
    port: process.env.SMTP_PORT, // SMTP port for Gmail (465 for secure SSL connection)
    secure: true,
    auth: 
    {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = 
  {
    from: process.env.EMAIL_ID,
    to: mid,
    subject: subData,
    text: txtData,
    html: htmlData,
  	attachments: attachments,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => 
  {
    if (error) 
    {
      console.log('Error:', error);
    } 
    else 
    {
      console.log(`Email sent:to ${mid}`, info.response);
    }
  });
}




const sendRegistrationEmail = async (userId, email, name) => 
{
  const emailVerificationToken = jwt.sign(
    { userId: userId, email: email, purpose: "email_verification" },
    process.env.JWT_SECRET,
    { expiresIn: "30m" }
  );

  const verificationLink = `${process.env.BASE_URL}/api/verify-email/user?token=${emailVerificationToken}`;

  const subject = `Confirm your email address for your account`;
  const textBody = `Hello ${name},\n\nThank you for signing up. Please confirm your email address by visiting the following link:\n\n${verificationLink}\n\nThis link will expire in 30 minutes.\n\nIf you did not create an account, no further action is required.`;

  const htmlBody = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Confirm Your Email Address</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #f8fafc;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          color: #1e293b;
          -webkit-text-size-adjust: 100%;
        }
        .wrapper {
          width: 100%;
          table-layout: fixed;
          background-color: #f8fafc;
          padding: 40px 0;
        }
        .main-card {
          background-color: #ffffff;
          margin: 0 auto;
          width: 100%;
          max-width: 580px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          border-collapse: separate;
        }
        .content {
          padding: 40px 32px;
        }
        h1 {
          font-size: 20px;
          font-weight: 600;
          color: #0f172a;
          margin: 0 0 16px 0;
          line-height: 1.4;
        }
        p {
          font-size: 15px;
          line-height: 1.6;
          color: #334155;
          margin: 0 0 20px 0;
        }
        .btn-container {
          padding: 12px 0 24px 0;
        }
        .btn {
          background-color: #2563eb;
          color: #ffffff !important;
          display: inline-block;
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          padding: 12px 28px;
          border-radius: 6px;
          text-align: center;
        }
        .fallback-text {
          font-size: 13px;
          color: #64748b;
          line-height: 1.5;
          word-break: break-all;
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid #f1f5f9;
        }
        .footer {
          padding: 24px 32px;
          background-color: #f8fafc;
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
          font-size: 12px;
          color: #94a3b8;
          text-align: center;
        }
        .footer a {
          color: #64748b;
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <table class="main-card" role="presentation" cellpadding="0" cellspacing="0">
          <tr>
            <td class="content">
              <h1>Confirm your email address</h1>
              <p>Hello ${name},</p>
              <p>Thank you for registering. Please confirm your email address to complete your registration and activate your account.</p>
              
              <div class="btn-container">
                <a href="${verificationLink}" target="_blank" class="btn">Confirm Email Address</a>
              </div>

              <p>This verification link is valid for <strong>30 minutes</strong>. If you did not create an account with us, you can safely ignore this message.</p>

              <div class="fallback-text">
                If the button above doesn't work, copy and paste this link into your web browser:<br>
                <a href="${verificationLink}" style="color: #2563eb;">${verificationLink}</a>
              </div>
            </td>
          </tr>
          <tr>
            <td class="footer">
              <p>This email was sent to ${email} as part of an account sign-up process.</p>
              <p>&copy; ${new Date().getFullYear()} ${process.env.APP}. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </div>
    </body>
    </html>
  `;

  return await sendEmail(email, subject, textBody, htmlBody);
};





const sendOtpEmail = async (email, otp, name = "User") => {
    const subject = "🔐 Password Reset OTP - Action Required";

    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>OTP Verification</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: #f4f6f9;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 500px;
                    margin: 30px auto;
                    background: #ffffff;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
                }
                .header {
                    background: #ffffff;
                    color: #1e293b;
                    padding: 25px 25px 10px 25px;
                    text-align: center;
                    border-bottom: 1px solid #f1f5f9;
                }
                .header h1 {
                    margin: 0;
                    font-size: 22px;
                    font-weight: 600;
                }
                .content {
                    padding: 25px;
                    text-align: center;
                    color: #334155;
                }
                .content p {
                    font-size: 15px;
                    line-height: 1.6;
                    margin-bottom: 20px;
                }
                .otp-box {
                    display: inline-block;
                    background-color: #f8fafc;
                    border: 2px dashed #cbd5e1;
                    border-radius: 8px;
                    padding: 12px 24px;
                    font-size: 32px;
                    font-weight: bold;
                    letter-spacing: 6px;
                    color: #4f46e5;
                    margin: 15px 0;
                }
                .warning {
                    font-size: 13px;
                    color: #64748b;
                    margin-top: 20px;
                }
                .footer {
                    background-color: #f8fafc;
                    padding: 15px;
                    text-align: center;
                    font-size: 12px;
                    color: #94a3b8;
                    border-top: 1px solid #e2e8f0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Password Reset Request</h1>
                </div>
                <div class="content">
                    <p>Hello <strong>${name}</strong>,</p>
                    <p>We received a request to reset your password. Use the 6-digit OTP below to proceed:</p>
                    
                    <div class="otp-box">${otp}</div>

                    <p>This OTP is valid for <strong>10 minutes</strong>.</p>
                    
                    <p class="warning">If you did not request a password reset, please ignore this email.</p>
                </div>
                <div class="footer">
                    &copy; ${new Date().getFullYear()} ${process.env.APP} All rights reserved.
                </div>
            </div>
        </body>
        </html>
    `;

    return await sendEmail(email, subject, "",htmlContent);
};



module.exports = { sendRegistrationEmail, sendOtpEmail };
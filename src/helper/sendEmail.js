const nodemailer = require("nodemailer");

const sendEmailFun = async (to, subect, text, data) => {
  // Create a transporter using Gmail SMTP
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "vikasideiosoft@gmail.com",
      pass: "rzfd jjfq tibm fibq",
    },
  });
  // Compose the email
  const mailOptions = {
    from: "Secret-World <vikasideiosoft@gmail.com>", // Sender address
    to: to, // Receiver address(es). Separate multiple addresses by commas.
    subject: subect,
    text: text,
    html: `<html>
    <head>
    <title>Thanks</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <style type="text/css">
        td
        {
            padding: 0px;
            margin: 0px;
        }
    </style>
    </head>
    <body bgcolor="#FFFFFF" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">
      <table id="Table_01" width="400" height="400" border="0" cellpadding="0" cellspacing="0" style="background: #F6F6F6; margin: 0 auto;max-width: 650px;">
          <h4 style="color:#2569b2; text-align:center;">Secret-World </h4>
          <hr />
          <tr>
              <h4> Please Verify Your Email </h4>
            <td style="text-align: center;">
                <a  href="${data}" style="background-color: #2569B2; color: white; padding: 10px 20px;">Verify Email</a>
            </td>
          </tr>
          <tr style=" text-align: center; background: #F6F6F6;">
            <td>
                <p style="text-align: center;font-size:14px;color: #777777;font-family: arial;">copyright: 2023 Secret-World. </p>
                <br />
            </td>
          </tr>
    </table>
    </body>
    </html>`,};
  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};



const sendEmailOTPFun = async (to, subect, text, data) => {
  // Create a transporter using Gmail SMTP
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "vikasideiosoft@gmail.com",
      pass: "rzfd jjfq tibm fibq",
    },
  });

  // Compose the email
  const mailOptions = {
    from: "Secret-World <vikasideiosoft@gmail.com>", // Sender address
    to: to, // Receiver address(es). Separate multiple addresses by commas.
    subject: subect,
    text: text,
    html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:70%;padding:20px 0">
      <div style="border-bottom:1px solid #eee">
        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Secret World</a>
      </div>
      <p style="font-size:1.1em">Hi,</p>
      <p>Thank you for choosing Secret World. Use the following OTP to procedures.</p>
      <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${data}</h2>
      <p style="font-size:0.9em;">Regards,<br />Secret World</p>
    </div>
  </div>`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

module.exports = {
  sendEmailFun,
  sendEmailOTPFun
};


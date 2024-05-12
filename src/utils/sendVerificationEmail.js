import nodemailer from "nodemailer";

export const sendVerificationEmail = (name, email, id) => {
  console.log("email: ", email);
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: "monty.bashirian@ethereal.email",
        pass: "5pDt5nCSDcqTkMJTVu",
      },
    });
    const option = {
      from: "monty.bashirian@ethereal.email",
      to: email,
      subject: "For Verification Mail",
      html: `<p>Hi, ${name} ,Please click here to <a href="http://localhost:8000/api/v1/users/verify?id=${id}">verify</a></p>`, // html body
    };
    transporter.sendMail(option, (error, info) => {
      if (error) {
        console.log(error.message || "Failed to send email for verification");
      } else {
        console.log("Email has been send ", info.response);
      }
    });
  } catch (error) {
    console.log(error.message || "Something Went Wrong !!");
  }
};
export default sendVerificationEmail;

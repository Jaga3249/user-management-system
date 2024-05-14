import nodemailer from "nodemailer";

export const sendVerificationEmail = (name, email, id) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: "jagannathbehera0244@gmail.com",
        pass: "wghmrtwhnlhcztyu",
      },
    });
    const option = {
      from: "Jagannath Behera",
      to: email,
      subject: "For Verification Mail",
      html: `<P>Hi ,${name},Please click here to <a href="http://localhost:8000/api/v1/users/verify?id=${id}">verify</a> your gmail</p>`,
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

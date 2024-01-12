import nodemailer, { TransportOptions, Transporter } from "nodemailer";

type emailT = {
  email: string;
  subject: string;
  message: string;
};

export const sendEmail = async (options: emailT) => {
  // 1. Create transporter
  const transporter = nodemailer.createTransport({
    // service: "Gmail",
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    // secure: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
      // password: process.env.GMAIL_2AUTH_PASSWORD,
    },
  } as TransportOptions);

  // 2. Define email options
  const mailOptions = {
    from: "Okami <storyvaultdev@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  console.log(1);
  console.log(mailOptions);
  // 3. Send Email
  await transporter.sendMail(mailOptions);
};

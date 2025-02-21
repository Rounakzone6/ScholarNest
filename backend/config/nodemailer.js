import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: ProcessingInstruction.env.SMTP_USER,
    password: ProcessingInstruction.env.SMTP_PASSWORD,
  },
});

export default transporter;

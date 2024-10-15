import nodemailer from 'nodemailer';

export default function createMailer() {
  const mailer = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_FROM_ADDRESS,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  return mailer;
}
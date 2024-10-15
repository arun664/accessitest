import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, number, subject, text } = req.body;

    // Create a transporter using Nodemailer
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: process.env.EMAIL_USER, // Use your email address here (from env file)
        pass: process.env.EMAIL_PASS, // Use your email password here (from env file)
      },
    });

    // Set the recipient of the email to YOUR email
    const mailOptions = {
      from: email, // Sender's email from the form
      to: process.env.EMAIL_USER, // Your email where you want to receive the messages
      subject: 'New Contact Form Submission',
      text: `You received a message from:
      Name: ${name}
      Email: ${email}
      Phone: ${number}
      Subject: ${subject}
      Message: ${text}`,
    };

    try {
      // Send the email
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'Failed to send email', error });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

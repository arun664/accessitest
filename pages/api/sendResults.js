import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const {email, text } = req.body;
    console.log(text)

    // Create a transporter using Nodemailer
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, // Use your email password here (from env file)
      },
    });

    
    const mailOptions = {
      from: process.env.EMAIL_USER, 
      to: email, 
      subject: 'Results for Accessibility Test',
      text: `Below are the results for the accessibility test:
      ${text}`,
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

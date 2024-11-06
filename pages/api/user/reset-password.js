import { db } from '@/config/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore/lite';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

async function getUserByEmail(email) {
  try {
    const usersRef = collection(db, 'users'); 
    const emailQuery = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(emailQuery); 

    
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      return {
        username: userData.username,
        email: userData.email,
      };
    } else {
      return null; 
    }
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw new Error('Failed to fetch user by email');
  }
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    try {
      const user = await getUserByEmail(email);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const resetToken = jwt.sign(
        { username: user.username, email: user.email },
        process.env.SECRET_KEY,
        { expiresIn: '5m' }
      );

      let resetUrl;

      // Construct the reset password URL
      if(`${process.env.VERCEL_ENV}` === "production") {
         resetUrl = `${process.env.PRODUCTION_URL}/reset-password/${resetToken}`
      } else {
        resetUrl = `${process.env.BASE_URL}/reset-password/${resetToken}`
      }

      // Use Nodemailer to send the reset password email
      const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Password Reset Request',
        html: `
          <html>
            <body>
              <p>Hello ${user.username},</p>
              <p>We received a request to reset your password. Please click the link below to reset it:</p>
              <p><a href="${resetUrl}" style="color: #007bff; text-decoration: none;">Reset your password</a></p>
              <p>If you did not request a password reset, please ignore this email.</p>
              <p>Best regards,</p>
              <p>Your Company Name</p>
            </body>
          </html>
        `,
      };
      

      // Send the email
      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: 'Password reset email sent successfully' });
    } catch (error) {
      console.error('Error generating reset password email:', error);
      res.status(500).json({ message: 'Failed to send reset password email', error });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
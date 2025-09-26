import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (email, code) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    await transporter.sendMail({
      from: 'Swadeshi Travel <noreply@swadeshitravel.com>',
      to: email,
      subject: 'Email Verification Code',
      text: `Your verification code is: ${code}`,
      html: `
        <h1>Welcome to Swadeshi Travel!</h1>
        <p>Your email verification code is: <strong>${code}</strong></p>
        <p>This code will expire in 10 minutes.</p>
      `
    });
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Could not send verification email');
  }
};

export const sendVerificationSMS = async (phone, code) => {
  try {
    // Implement SMS sending logic here
    // You can use services like Twilio, MessageBird, etc.
    console.log(`SMS verification code ${code} sent to ${phone}`);
  } catch (error) {
    console.error('SMS sending failed:', error);
    throw new Error('Could not send verification SMS');
  }
};
import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'TravelM8noreply@gmail.com',
      pass: 'mgis kukx ozqk dkkn',
    },
  });
  
  transporter.verify((error, success) => {
    if (error) {
      console.error('SMTP connection error:', error);
      console.log("email:", transporter.auth);
    } else {
      console.log('SMTP server is ready to send emails!');
    }
  });
  
  
  export const sendOTP = async (email, otp) => {
    try {
      const mailOptions = {
        from: 'TravelM8.noreply <TravelM8noreply@gmail.com>',
        to: email,
        subject: 'Password Reset OTP',
        text: `Your OTP for resetting your password is: ${otp}`,
        html: `<p>Your OTP for resetting your password is: <b>${otp}</b></p>`,
      };
  
      const result = await transporter.sendMail(mailOptions);
      console.log('Email sent:', result);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send OTP. Please try again.');
    }
  };
  
  export const sendEmail = async (to, subject, html) => {
    try {
      const mailOptions = {
        from: 'TravelM8.noreply <TravelM8noreply@gmail.com>',
        to,
        subject,
        html,
      };
  
      const result = await transporter.sendMail(mailOptions);
      console.log('Email sent:', result);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email.');
    }
  };

  export const sendBirthdayPromoCode = async (to, promoCode) => {
    try {
        const mailOptions = {
            from: 'TravelM8.noreply <TravelM8noreply@gmail.com>',
            to,
            subject: 'Happy Birthday! Here’s a Promo Code Just for You!',
            text: `Happy Birthday! Use the promo code ${promoCode} to get a discount on your next purchase!`,
            html: `<p>Happy Birthday! Use the promo code <b>${promoCode}</b> to get a discount on your next purchase!</p>`,
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Birthday promo code email sent:', result);
    } catch (error) {
      console.log("emai:", to);
        console.error('Error sending birthday promo code email:', error);
        throw new Error('Failed to send birthday promo code email.');
    }
};

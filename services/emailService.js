import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sanju.kumari@tothenew.com', 
        pass: 'mfzf nkph kqgh nazi' 
    }
});

export const sendEmail = async (mail_to, subject, text) => {
    try {
        const mailOptions = {
            from: 'sanju.kumari@gmail.com',
            to: mail_to,
            subject: subject,
            text: text
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!!!!!');
        return { success: true };

    } catch (error) {
        console.log('Error sending email:', error);
        return { success: false, error: error.message };
    }
};

import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    }
});

transport.verify((error, success) => {
    if (error) {
        console.log("❌ SMTP Error:", error);
    } else {
        console.log("✅ SMTP server is ready");
    }
});

export default transport;
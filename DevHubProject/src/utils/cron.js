const cron = require("node-cron");
const nodemailer = require("nodemailer");
const { User } = require("../models/user");

const sendMailToUsers = async (emailLists) => {
  console.log("2. Sending emails to:", emailLists);
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.NODE_MAILER_EMAIL,
      pass: process.env.NODE_MAILER_PASSWORD,
    },
  });
  const mailOptions = {
    from: "Node Project",
    to: emailLists,
    subject: "cron test email",
    text: "Namaste Node Project",
    html: "<p>Namaste Node Project</p>",
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
  } catch (error) {
    console.error("Error sending email: ", error);
  }
};

cron.schedule("*/12 * * * * *", async () => {
  try {
    const users = await User.find({});
    const emailLists = users.map((item) => item.emailId);

    if (emailLists.length > 0) {
      console.log("Sending emails to:", emailLists);
      sendMailToUsers(emailLists);
    } else {
      console.log("No users found to send emails.");
    }
  } catch (err) {
    console.error("Error Running Cron Job: ", err);
  }
});

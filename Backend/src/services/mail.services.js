import nodenamiler from "nodemailer";

const transpoter = nodenamiler.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.GOOGLE_USER,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    clientId: process.env.GOOGLE_CLIENT_ID,
  },
});

transpoter
  .verify()
  .then(() => {
    console.log("Email transpoter is ready to send the mails");
  })
  .catch((err) => {
    console.error("Email transopter verification failed", err);
  });

export async function sendEmail({ to, text, html, subject }) {
  const mailOptions = {
    from: process.env.GOOGLE_USER,
    to,
    subject,
    html,
    text,
  };
  const details = await transpoter.sendMail(mailOptions);
  console.log("Email send", details);
}

import dbConnect from "./dbConnect";
import User from "../models/User";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

// Middleware function to check subscription status
const isSubscribed = async (email) => {
  await dbConnect();
  const user = await User.findOne({ email }).select("unsubscribed");

  if (!user || user.unsubscribed) {
    return false;
  }

  return true;
};

// Create a transporter with your email service provider's details
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Create jwt token with user's email
const token = (email) => jwt.sign({ email }, process.env.NEXTAUTH_SECRET);

const footerText = (email) =>
  `\n\n Ideal Board Games \n\n If you no longer wish to receive emails from us, please unsubscribe, using this link: ${
    process.env.DEPLOYED_URL
  }/api/unsubscribe/${token(email)} \n`;

const footerHtml = (email) => `<p>
  Ideal Board Games
</p>
<p>
  If you no longer wish to receive emails from us, please <a href="${
    process.env.DEPLOYED_URL
  }/api/unsubscribe/${token(
  email
)}" style="color: #999999; text-decoration: none;">unsubscribe</a>.
</p>`;

export { isSubscribed, transporter, footerText, footerHtml };

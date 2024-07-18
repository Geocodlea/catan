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
  `\n\n Ioana Mocanu \n Creative Board Gaming \n\n e: ioana.mocanu@cbgshop.ro \n t: 0736465213 \n w: www.cbgshop.ro / www.agames.ro \n f: www.facebook.com/CreativeBoardGaming \n\n If you no longer wish to receive emails from us, please unsubscribe, using this link: ${
    process.env.DEPLOYED_URL
  }/api/unsubscribe/${token(email)} \n`;

const footerHtml = (email) => `<p>
  Ioana Mocanu<br>
  Creative Board Gaming<br><br>
  e: <a href="mailto:ioana.mocanu@cbgshop.ro">ioana.mocanu@cbgshop.ro</a><br>
  t: <a href="tel:0736465213">0736465213</a><br>
  w: <a href="http://www.cbgshop.ro">www.cbgshop.ro</a> / <a href="http://www.agames.ro">www.agames.ro</a><br>
  f: <a href="http://www.facebook.com/CreativeBoardGaming">www.facebook.com/CreativeBoardGaming</a>
</p>
<p>
  If you no longer wish to receive emails from us, please <a href="${
    process.env.DEPLOYED_URL
  }/api/unsubscribe/${token(
  email
)}" style="color: #999999; text-decoration: none;">unsubscribe</a>.
</p>`;

export { isSubscribed, transporter, footerText, footerHtml };

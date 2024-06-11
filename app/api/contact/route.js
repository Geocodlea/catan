import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  const data = await request.json();

  console.log(data);

  // Create a transporter with your email service provider's details
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Send the email
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    subject: `Message from AGames - Contact Form`,
    text: `${data.message} \n\n Sent from: ${data.name} \n Email: ${data.email} \n Phone: ${data.phone}`,
  });

  return NextResponse.json({ success: true });
}

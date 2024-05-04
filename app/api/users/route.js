import dbConnect from "/utils/dbConnect";
import User from "/models/User";
import { NextResponse } from "next/server";

export async function POST(request) {
  const data = await request.json();

  if (!data.name || !data.email) {
    return NextResponse.json({
      success: false,
      message: "Numele și Emailul sunt obligatorii",
    });
  }

  await dbConnect();
  const emailExists = await User.findOne({ email: data.email });
  if (emailExists) {
    return NextResponse.json({
      success: false,
      message: "Emailul există deja",
    });
  }

  const user = new User(data);
  await user.save();

  return NextResponse.json({ success: true });
}

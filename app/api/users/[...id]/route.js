import dbConnect from "/utils/dbConnect";
import User from "/models/User";
import Account from "/models/Account";

import { NextResponse } from "next/server";

// Update user from profile
export async function PATCH(request, { params }) {
  const formData = await request.formData();
  const data = {};

  // Get all keys and values from the FormData object
  for (const [key, value] of formData.entries()) {
    if (value) data[key] = value;
  }

  await dbConnect();
  await User.updateOne({ _id: params.id }, data);

  return NextResponse.json({ success: true });
}

// Update user from admin
export async function PUT(request, { params }) {
  const data = await request.json();

  if (!data.name || !data.email) {
    return NextResponse.json({
      success: false,
      message: "Numele și Emailul sunt obligatorii",
    });
  }

  await dbConnect();
  const emailExists = await User.findOne({
    email: data.email,
    _id: { $ne: params.id },
  });
  if (emailExists) {
    return NextResponse.json({
      success: false,
      message: "Emailul există deja",
    });
  }

  const updatedUser = await User.findOneAndUpdate({ _id: params.id }, data);

  const success = !!updatedUser;
  return NextResponse.json({ success, message: "User-ul nu există" });
}

export async function DELETE(request, { params }) {
  await dbConnect();
  const deletedUser = await User.findOneAndDelete({ _id: params.id });

  if (!deletedUser) {
    return NextResponse.json({ success: false, message: "User-ul nu există" });
  }

  await Account.deleteMany({ userId: params.id });

  return NextResponse.json({ success: true });
}

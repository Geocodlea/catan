import { NextResponse } from "next/server";
import dbConnect from "/utils/dbConnect";
import User from "/models/User";
import jwt from "jsonwebtoken";

export async function GET(request, { params }) {
  const { token } = params;

  try {
    // Verify and decode the JWT token
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);
    const { email } = decoded;

    // Perform the unsubscribe action for the email provided in the JWT
    await dbConnect();
    await User.updateOne({ email }, { unsubscribed: true });

    return new NextResponse(
      `Your email address: "${email}" was unsubscribed from our mailing list.\n\nIf this was a mistake or if you change your mind, you can always update your subscription preferences in your profile settings.`,
      { status: 200 }
    );
  } catch (error) {
    console.error("JWT verification failed:", error);
    return new NextResponse("Unauthorized", { status: 401 });
  }
}

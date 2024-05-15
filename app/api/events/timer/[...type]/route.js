import dbConnect from "/utils/dbConnect";
import { NextResponse } from "next/server";

import * as Verifications from "@/models/Verifications";

export async function POST(request, { params }) {
  const [type] = params.type;
  const data = await request.json();

  if (isNaN(data.timerMinutes) || !data.timerMinutes) {
    return NextResponse.json({
      success: false,
      message: "Scorul trebuie să fie un număr",
    });
  }

  const now = new Date();
  const timer = new Date(now.getTime() + data.timerMinutes * 60 * 1000);
  const VerificationsType = Verifications[`Verificari_live_${type}`];

  await dbConnect();
  await VerificationsType.updateOne({ stop: true }, { timer });

  return NextResponse.json({ success: true });
}

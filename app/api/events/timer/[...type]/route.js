import dbConnect from "/utils/dbConnect";
import { NextResponse } from "next/server";

import mongoose from "mongoose";
import { createVerificationsModel } from "@/utils/createModels";

export async function POST(request, { params }) {
  const [type, eventID] = params.type;
  const data = await request.json();

  if (isNaN(data.timerMinutes) || !data.timerMinutes) {
    return NextResponse.json({
      success: false,
      message: "Timer-ul trebuie să fie un număr",
    });
  }

  const now = new Date();
  const timer = new Date(now.getTime() + data.timerMinutes * 60 * 1000);

  // Create models
  await dbConnect();
  await createVerificationsModel(eventID);
  const Verifications = mongoose.models[`Verificari_live_${eventID}`];

  await Verifications.updateOne({ stop: true }, { timer });

  return NextResponse.json({ success: true });
}

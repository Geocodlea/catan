import dbConnect from "/utils/dbConnect";
import { NextResponse } from "next/server";
import * as Participants from "@/models/Participants";
import * as Verifications from "@/models/Verifications";

export async function POST(request, { params }) {
  const ParticipantType = Participants[`Participanti_live_${params.type[0]}`];
  const VerificationsType = Verifications[`Verificari_live_${params.type[0]}`];

  await dbConnect();
  await VerificationsType.deleteMany();
  await VerificationsType.updateOne(
    { runda: 0 },
    { stop: true },
    { upsert: true }
  );

  const participants = await ParticipantType.find();

  await VerificationsType.insertMany(participants);

  return NextResponse.json({ success: true });
}

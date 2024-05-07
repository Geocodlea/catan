import dbConnect from "/utils/dbConnect";
import { NextResponse } from "next/server";
import * as Participants from "@/models/Participants";
import * as Verifications from "@/models/Verifications";

export async function DELETE(request, { params }) {
  const ParticipantType = Participants[`Participanti_live_${params.type[0]}`];
  const VerificationsType = Verifications[`Verificari_live_${params.type[0]}`];

  await dbConnect();
  await ParticipantType.deleteMany();

  await VerificationsType.updateOne({ runda: 0 }, { stop: false });

  return NextResponse.json({ success: true });
}

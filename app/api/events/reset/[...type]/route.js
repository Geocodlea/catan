import dbConnect from "/utils/dbConnect";
import { NextResponse } from "next/server";
import * as Participants from "@/models/Participants";
import * as Verifications from "@/models/Verifications";

export async function DELETE(request, { params }) {
  const [type] = params.type;

  const ParticipantType = Participants[`Participanti_live_${type}`];
  const VerificationsType = Verifications[`Verificari_live_${type}`];

  await dbConnect();
  await ParticipantType.deleteMany();

  await VerificationsType.updateOne({ round: 0 }, { stop: false });

  return NextResponse.json({ success: true });
}

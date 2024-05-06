import dbConnect from "/utils/dbConnect";
import { NextResponse } from "next/server";
import * as Participants from "@/models/Participants";

export async function DELETE(request, { params }) {
  const ParticipantType = Participants[`Participanti_live_${params.type[0]}`];

  await dbConnect();
  await ParticipantType.deleteMany();

  return NextResponse.json({ success: true });
}

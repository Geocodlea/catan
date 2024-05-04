import dbConnect from "/utils/dbConnect";
import { NextResponse } from "next/server";
import * as Participants from "@/models/Participants";

export async function POST(request, { params }) {
  const session = await request.json();

  if (Object.keys(session).length === 0) {
    return NextResponse.json({ success: false, message: "Nu ești logat" });
  }

  const ParticipantType = Participants[`Participanti_live_${params.type[0]}`];

  await dbConnect();

  const registeredParticipant = await ParticipantType.findOne({
    id: session.user.id,
  });

  if (registeredParticipant) {
    return NextResponse.json({ success: false, message: "Ești deja înscris" });
  }

  const participant = new ParticipantType(session.user);
  await participant.save();

  return NextResponse.json({ success: true });
}

export async function DELETE(request, { params }) {
  const user = await request.json();

  if (Object.keys(user).length === 0) {
    return NextResponse.json({ success: false, message: "Nu ești logat" });
  }

  const ParticipantType = Participants[`Participanti_live_${params.type[0]}`];

  await dbConnect();

  const registeredParticipant = await ParticipantType.findOne({
    id: user.id,
  });
  if (!registeredParticipant) {
    return NextResponse.json({ success: false, message: "Nu ești înscris" });
  }

  await ParticipantType.deleteOne({ id: user.id });

  return NextResponse.json({ success: true });
}

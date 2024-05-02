import dbConnect from "/utils/dbConnect";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  const session = await request.json();
  const participantModule = await import(
    `@/models/participants/${params.type[0]}`
  );

  await dbConnect();
  const ParticipantType = participantModule.default;
  const participant = new ParticipantType(session.user);
  await participant.save();

  return NextResponse.json({ success: true });
}

export async function DELETE(request, { params }) {
  const user = await request.json();
  const participantModule = await import(
    `@/models/participants/${params.type[0]}`
  );

  await dbConnect();
  const ParticipantType = participantModule.default;
  await ParticipantType.deleteOne({ id: user.id });

  return NextResponse.json({ success: true });
}

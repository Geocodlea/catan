import dbConnect from "/utils/dbConnect";
import { NextResponse } from "next/server";
import * as Participants from "@/models/Participants";

export async function GET(request, { params }) {
  const ParticipantType = Participants[`Participanti_live_${params.type[0]}`];

  await dbConnect();
  const participants = await ParticipantType.find().select("id name email");

  return NextResponse.json(participants);
}

export async function POST(request, { params }) {
  const data = await request.json();

  if (!data.name) {
    return NextResponse.json({
      success: false,
      message: "Numele este obligatoriu",
    });
  }

  const ParticipantType = Participants[`Participanti_live_${params.type[0]}`];

  await dbConnect();
  const participant = new ParticipantType(data);
  await participant.save();

  return NextResponse.json({ success: true });
}

export async function PUT(request, { params }) {
  const data = await request.json();

  if (!data.name) {
    return NextResponse.json({
      success: false,
      message: "Numele este obligatoriu",
    });
  }

  const ParticipantType = Participants[`Participanti_live_${params.type[1]}`];

  await dbConnect();
  await ParticipantType.updateOne({ id: params.type[0] }, data);

  return NextResponse.json({ success: true });
}

export async function DELETE(request, { params }) {
  const ParticipantType = Participants[`Participanti_live_${params.type[1]}`];

  await dbConnect();
  await ParticipantType.deleteOne({ id: params.type[0] });

  return NextResponse.json({ success: true });
}

import dbConnect from "/utils/dbConnect";
import { NextResponse } from "next/server";
import * as Participants from "@/models/Participants";

export async function GET(request, { params }) {
  const [type] = params.type;
  const ParticipantType = Participants[`Participanti_live_${type}`];

  await dbConnect();
  const participants = await ParticipantType.find()
    .select("id name email obs rude")
    .sort("_id");

  return NextResponse.json(participants);
}

export async function POST(request, { params }) {
  const [type] = params.type;
  const data = await request.json();

  if (!data.name) {
    return NextResponse.json({
      success: false,
      message: "Numele este obligatoriu",
    });
  }

  const ParticipantType = Participants[`Participanti_live_${type}`];

  await dbConnect();
  const participant = new ParticipantType(data);
  await participant.save();

  return NextResponse.json({ success: true });
}

export async function PUT(request, { params }) {
  const [type, id] = params.type;
  const data = await request.json();

  if (!data.name) {
    return NextResponse.json({
      success: false,
      message: "Numele este obligatoriu",
    });
  }

  const ParticipantType = Participants[`Participanti_live_${type}`];

  await dbConnect();
  await ParticipantType.updateOne({ id }, data);

  return NextResponse.json({ success: true });
}

export async function DELETE(request, { params }) {
  const [type, id] = params.type;
  const ParticipantType = Participants[`Participanti_live_${type}`];

  await dbConnect();
  await ParticipantType.deleteOne({ id });

  return NextResponse.json({ success: true });
}

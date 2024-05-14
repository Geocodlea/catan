import dbConnect from "/utils/dbConnect";
import { NextResponse } from "next/server";
import * as Amical from "@/models/Amical";

export async function GET(request, { params }) {
  const [type] = params.type;
  const AmicalType = Amical[`Amical_live_${type}`];

  await dbConnect();
  const amical = await AmicalType.find().select("id name email").sort("_id");

  return NextResponse.json(amical);
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

  const AmicalType = Amical[`Amical_live_${type}`];

  await dbConnect();
  const participant = new AmicalType(data);
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

  const AmicalType = Amical[`Amical_live_${type}`];

  await dbConnect();
  await AmicalType.updateOne({ id }, data);

  return NextResponse.json({ success: true });
}

export async function DELETE(request, { params }) {
  const [type, id] = params.type;
  const AmicalType = Amical[`Amical_live_${type}`];

  await dbConnect();
  await AmicalType.deleteOne({ id });

  return NextResponse.json({ success: true });
}

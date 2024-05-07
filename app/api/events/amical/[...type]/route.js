import dbConnect from "/utils/dbConnect";
import { NextResponse } from "next/server";
import * as Amical from "@/models/Amical";

export async function GET(request, { params }) {
  const AmicalType = Amical[`Amical_live_${params.type[0]}`];

  await dbConnect();
  const amical = await AmicalType.find().select("id name email").sort("_id");

  return NextResponse.json(amical);
}

export async function POST(request, { params }) {
  const data = await request.json();

  if (!data.name) {
    return NextResponse.json({
      success: false,
      message: "Numele este obligatoriu",
    });
  }

  const AmicalType = Amical[`Amical_live_${params.type[0]}`];

  await dbConnect();
  const participant = new AmicalType(data);
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

  const AmicalType = Amical[`Amical_live_${params.type[1]}`];

  await dbConnect();
  await AmicalType.updateOne({ id: params.type[0] }, data);

  return NextResponse.json({ success: true });
}

export async function DELETE(request, { params }) {
  const AmicalType = Amical[`Amical_live_${params.type[1]}`];

  await dbConnect();
  await AmicalType.deleteOne({ id: params.type[0] });

  return NextResponse.json({ success: true });
}

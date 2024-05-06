import dbConnect from "/utils/dbConnect";
import { NextResponse } from "next/server";
import * as Participants from "@/models/Participants";

export async function GET(request, { params }) {
  console.log(params.type);

  return NextResponse.json({ success: true });
}

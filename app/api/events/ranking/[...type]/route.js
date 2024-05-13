import dbConnect from "/utils/dbConnect";
import * as Clasament from "/models/Clasament";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const [type] = params.type;

  const ClasamentType = Clasament[`Clasament_live_${type}`];

  await dbConnect();
  const clasament = await ClasamentType.find();

  return NextResponse.json(clasament);
}

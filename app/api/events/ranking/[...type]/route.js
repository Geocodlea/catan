import dbConnect from "/utils/dbConnect";
import * as Clasament from "/models/Clasament";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const [type] = params.type;

  const ClasamentType = Clasament[`Clasament_live_${type}`];

  await dbConnect();
  if (type === "whist") {
    const clasament = await ClasamentType.find().sort({
      punctetotal: -1,
      procent: -1,
    });

    return NextResponse.json(clasament);
  }

  const clasament = await ClasamentType.find().sort({
    punctetotal: -1,
    scorjocuri: -1,
    procent: -1,
  });

  return NextResponse.json(clasament);
}

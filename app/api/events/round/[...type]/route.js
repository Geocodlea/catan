import dbConnect from "/utils/dbConnect";
import { NextResponse } from "next/server";
import * as Verifications from "@/models/Verifications";

export async function GET(request, { params }) {
  const [type] = params.type;

  await dbConnect();
  const VerificationsType = Verifications[`Verificari_live_${type}`];
  const verifications = await VerificationsType.findOne({
    round: { $exists: true },
  }).select("round");
  const round = verifications ? verifications.round : 0;

  return NextResponse.json(round);
}

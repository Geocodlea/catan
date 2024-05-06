import dbConnect from "/utils/dbConnect";
import { NextResponse } from "next/server";
import * as Verifications from "@/models/Verifications";

export async function PATCH(request, { params }) {
  const VerificationsType = Verifications[`Verificari_live_${params.type[0]}`];

  await dbConnect();
  await VerificationsType.updateOne({ runda: 0 }, { stop: true });

  return NextResponse.json({ success: true });
}

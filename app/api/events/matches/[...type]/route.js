import { NextResponse } from "next/server";
import dbConnect from "/utils/dbConnect";
import * as Matches from "/models/Matches";

export async function GET(request, { params }) {
  const [type, round] = params.type;

  const MatchType = Matches[`Meciuri_live_${type}_${round}`];

  await dbConnect();
  const matches = await MatchType.find()
    .select("id table name score")
    .sort("table");

  return NextResponse.json(matches);
}

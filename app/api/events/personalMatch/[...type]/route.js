import dbConnect from "/utils/dbConnect";
import * as Matches from "/models/Matches";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const [type, round, userID] = params.type;

  const MatchType = Matches[`Meciuri_live_${type}_${round}`];

  await dbConnect();
  // Find the table value associated with the given userID
  const user = await MatchType.findOne({
    id: userID,
  }).select("table");

  if (!user) return NextResponse.json({});

  // Find all entries with the same "table" value
  const personalMatch = await MatchType.find({ table: user.table }).select(
    "id name score"
  );

  return NextResponse.json(personalMatch);
}

export async function PUT(request, { params }) {
  const [type, round, userID] = params.type;

  const MatchType = Matches[`Meciuri_live_${type}_${round}`];

  await dbConnect();
  // Find the table value associated with the given userID
  const user = await MatchType.findOne({
    id: userID,
  }).select("table");

  // Find all entries with the same "table" value
  const personalMatch = await MatchType.find({ table: user.table }).select(
    "id name score"
  );

  return NextResponse.json(personalMatch);
}

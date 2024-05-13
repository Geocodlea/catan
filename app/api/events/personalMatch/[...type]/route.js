import dbConnect from "/utils/dbConnect";
import * as Matches from "/models/Matches";
import { NextResponse } from "next/server";
import * as Verifications from "@/models/Verifications";

import { calculateScores } from "@/utils/calculateScores";

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
    "id table name score"
  );

  return NextResponse.json(personalMatch);
}

export async function PUT(request, { params }) {
  const [id, type, round] = params.type;
  const data = await request.json();

  if (isNaN(data.score) || !data.score) {
    return NextResponse.json({
      success: false,
      message: "Scorul trebuie să fie un număr",
    });
  }

  const score = Number(data.score);
  const MatchType = Matches[`Meciuri_live_${type}_${round}`];
  const VerificationsType = Verifications[`Verificari_live_${type}`];

  await dbConnect();
  const eventFinished = await VerificationsType.findOne({
    round: 0,
  });
  if (eventFinished) {
    return NextResponse.json({
      success: false,
      message: "Evenimentul este încheiat",
    });
  }

  // Update the score and find if all scores are filled
  await MatchType.updateOne({ id }, { score });
  const tableScores = await MatchType.find({
    table: data.table,
    score: null,
  });
  if (tableScores.length) {
    return NextResponse.json({ success: true });
  }

  const scores = await MatchType.find({
    table: data.table,
  })
    .select("score")
    .sort({ score: -1 });

  console.log(scores);

  const points = calculateScores(type, scores);

  console.log(points);

  return NextResponse.json({ success: true });
}

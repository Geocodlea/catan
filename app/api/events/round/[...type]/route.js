import dbConnect from "/utils/dbConnect";
import { NextResponse } from "next/server";
import * as Participants from "@/models/Participants";
import * as Verifications from "@/models/Verifications";
import * as Matches from "@/models/Matches";
import * as Clasament from "@/models/Clasament";

export async function GET(request, { params }) {
  const [type] = params.type;

  const VerificationsType = Verifications[`Verificari_live_${type}`];

  await dbConnect();
  const verification = await VerificationsType.findOne({
    round: { $exists: true },
  }).select("round");
  let round = verification.round;

  if (round === 0) {
    return NextResponse.json(round);
  }

  const MatchesType = Matches[`Meciuri_live_${type}_${round}`];

  const roundScores = await MatchesType.find({
    score: null,
  }).count();
  const allScoresSubmitted = roundScores === 0;

  if (allScoresSubmitted) {
    round++;
    const ClasamentType = Clasament[`Clasament_live_${type}`];
    const ParticipantType = Participants[`Participanti_live_${type}`];

    await VerificationsType.updateOne({ stop: true }, { round, timer: null });
  }

  return NextResponse.json(round);
}

import dbConnect from "/utils/dbConnect";
import { NextResponse } from "next/server";
import * as Participants from "@/models/Participants";
import * as Verifications from "@/models/Verifications";
import * as Matches from "@/models/Matches";
import * as Clasament from "@/models/Clasament";

import { sortOrder } from "@/utils/sortRanking";

export async function DELETE(request, { params }) {
  const [type, round, isFinalRound] = params.type;

  const ParticipantType = Participants[`Participanti_live_${type}`];
  const VerificationsType = Verifications[`Verificari_live_${type}`];
  const MatchesType = Matches[`Meciuri_live_${type}_${round}`];
  const ClasamentType = Clasament[`Clasament_live_${type}`];

  await dbConnect();

  if (isFinalRound) {
    const roundScores = await MatchesType.find({
      score: null,
    }).count();
    const allScoresSubmitted = roundScores === 0;

    if (!allScoresSubmitted) {
      return NextResponse.json({
        success: false,
        message: "Nu sunt introduse toate scorurile",
      });
    }

    const leaderboard = await ClasamentType.find().sort(sortOrder(type));

    console.log(leaderboard);
    return NextResponse.json(leaderboard);
  }

  await ParticipantType.deleteMany();

  await VerificationsType.updateOne(
    { round: { $exists: true } },
    { stop: false, round: 0, timer: null }
  );
  await MatchesType.collection.drop();
  await ClasamentType.collection.drop();

  return NextResponse.json({ success: true });
}

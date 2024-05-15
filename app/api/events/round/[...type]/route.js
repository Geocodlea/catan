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

  let MatchesType = Matches[`Meciuri_live_${type}_${round}`];

  const roundScores = await MatchesType.find({
    score: null,
  }).count();
  const allScoresSubmitted = roundScores === 0;

  if (!allScoresSubmitted) {
    return NextResponse.json(round);
  }

  // All scores submitted, start the next round
  round++;
  MatchesType = Matches[`Meciuri_live_${type}_${round}`];
  const ClasamentType = Clasament[`Clasament_live_${type}`];
  const ParticipantType = Participants[`Participanti_live_${type}`];

  const participantsNumber = await ParticipantType.countDocuments();
  if (participantsNumber < 4) {
    return NextResponse.json({
      success: false,
      message: "Nu sunt minim 4 înscriși",
    });
  }

  const participants = await ParticipantType.aggregate([
    {
      $lookup: {
        from: "clasament_live_catan",
        localField: "id",
        foreignField: "id",
        as: "participants",
      },
    },
    {
      $unwind: {
        path: "$participants",
      },
    },
    {
      $project: {
        name: 1,
        punctetotal: "$participants.punctetotal",
        scorjocuri: "$participants.scorjocuri",
        procent: "$participants.procent",
      },
    },
    {
      $sort: {
        punctetotal: -1,
        scorjocuri: -1,
        procent: -1,
      },
    },
  ]);

  // await createMatches(
  //   type,
  //   participantsNumber,
  //   playersPerTable,
  //   MatchesType,
  //   participants
  // );

  console.log(MatchesType);

  // await VerificationsType.updateOne({ stop: true }, { round, timer: null });

  return NextResponse.json(round);
}

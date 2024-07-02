import dbConnect from "/utils/dbConnect";
import { NextResponse } from "next/server";
import * as Participants from "@/models/Participants";
import * as Verifications from "@/models/Verifications";
import * as Matches from "@/models/Matches";

import nodemailer from "nodemailer";
import { emailFooter } from "@/utils/emailFooter";

import { createMatches } from "@/utils/createMatches";

export async function GET(request, { params }) {
  const [type] = params.type;

  const VerificationsType = Verifications[`Verificari_live_${type}`];

  await dbConnect();
  const verification = await VerificationsType.findOne({
    round: { $exists: true },
  }).select("round");
  let round = verification.round;

  const isFinalRound =
    type === "catan"
      ? round === 3
      : type === "cavaleri" || type === "whist"
      ? round === 2
      : type === "rentz"
      ? round === 1
      : false;

  if (round === 0) {
    return NextResponse.json({ round, isFinalRound });
  }

  let MatchesType = Matches[`Meciuri_live_${type}_${round}`];

  const roundScores = await MatchesType.find({
    score: null,
  }).count();
  const allScoresSubmitted = roundScores === 0;

  if (!allScoresSubmitted) {
    return NextResponse.json({ round, isFinalRound });
  }

  if (isFinalRound) {
    await VerificationsType.updateOne(
      { stop: true },
      { stop: false, timer: null }
    );
    return NextResponse.json({ round, isFinalRound, isFinished: true });
  }

  // All scores submitted, start the next round
  round++;
  await VerificationsType.updateOne({ stop: true }, { round, timer: null });

  MatchesType = Matches[`Meciuri_live_${type}_${round}`];
  const ParticipantType = Participants[`Participanti_live_${type}`];
  let participantsNumber = await ParticipantType.countDocuments();

  if (type === "whist") {
    participantsNumber = 6;
  }
  const playersPerTable = "6";

  const participants = await ParticipantType.aggregate([
    {
      $lookup: {
        from: `clasament_live_${type}`,
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
        id: 1,
        name: 1,
        email: 1,
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

  await createMatches(
    type,
    participantsNumber,
    playersPerTable,
    MatchesType,
    participants
  );

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Send emails to all participants
  participants
    .filter((participant) => participant.email)
    .forEach(async (participant) => {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: participant.email,
        subject: `Concurs Catan`,
        text: `Start runda ${round} ${emailFooter}`,
      });
    });

  return NextResponse.json({ round, isFinalRound });
}

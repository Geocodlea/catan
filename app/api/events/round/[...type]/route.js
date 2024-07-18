import dbConnect from "/utils/dbConnect";
import { NextResponse } from "next/server";

import {
  isSubscribed,
  transporter,
  footerText,
  footerHtml,
} from "/utils/emailHelpers";

import Event from "/models/Event";
import mongoose from "mongoose";
import {
  createParticipantsModel,
  createVerificationsModel,
  createMatchesModel,
  createClasamentModel,
} from "@/utils/createModels";

import { createMatches } from "@/utils/createMatches";

export async function GET(request, { params }) {
  const [type, eventID] = params.type;

  await dbConnect();
  const event = await Event.findOne({ _id: eventID });

  // If the event does not exist, redirect to homepage
  if (!event) {
    return NextResponse.json({ noEvent: true });
  }

  // Create models
  await createParticipantsModel(eventID);
  await createVerificationsModel(eventID);
  const Participants = mongoose.models[`Participanti_live_${eventID}`];
  const Verifications = mongoose.models[`Verificari_live_${eventID}`];

  const verification = await Verifications.findOne({
    round: { $exists: true },
  }).select("round");
  let round = verification.round;

  const isFinalRound = type === "catan" ? round === 3 : false;

  if (round === 0) {
    return NextResponse.json({ round, isFinalRound });
  }

  await createMatchesModel(eventID, round);
  let Matches = mongoose.models[`Meciuri_live_${eventID}_${round}`];

  const roundScores = await Matches.find({
    score: null,
  }).count();
  const allScoresSubmitted = roundScores === 0;

  if (!allScoresSubmitted) {
    return NextResponse.json({ round, isFinalRound });
  }

  if (isFinalRound) {
    await Verifications.updateOne({ stop: true }, { stop: false, timer: null });
    return NextResponse.json({ round, isFinalRound, isFinished: true });
  }

  // All scores submitted, start the next round
  round++;
  await Verifications.updateOne({ stop: true }, { round, timer: null });

  await createMatchesModel(eventID, round);
  Matches = mongoose.models[`Meciuri_live_${eventID}_${round}`];

  const participantsNumber = await Participants.countDocuments();
  const playersPerTable = "6";

  await createClasamentModel(eventID);
  const participants = await Participants.aggregate([
    {
      $lookup: {
        from: `clasament_live_${eventID}`,
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
    Matches,
    participants,
    eventID
  );

  // Send emails to all participants
  participants
    .filter((participant) => participant.email)
    .forEach(async (participant) => {
      if (await isSubscribed(participant.email)) {
        await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: participant.email,
          subject: `Concurs Catan`,
          text: `Start runda ${round} ${footerText(participant.email)}`,
          html: `<h1>Start runda ${round}</h1> ${footerHtml(
            participant.email
          )}`,
        });
      }
    });

  return NextResponse.json({ round, isFinalRound });
}

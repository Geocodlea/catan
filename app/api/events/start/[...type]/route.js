import dbConnect from "/utils/dbConnect";
import { NextResponse } from "next/server";

import {
  isSubscribed,
  transporter,
  footerText,
  footerHtml,
} from "/utils/emailHelpers";

import Event from "@/models/Event";
import OldParticipants from "@/models/OldParticipants";

import mongoose from "mongoose";
import {
  createParticipantsModel,
  createVerificationsModel,
  createMatchesModel,
  createClasamentModel,
} from "@/utils/createModels";

import { createMatches } from "@/utils/createMatches";

export async function POST(request, { params }) {
  const [type, playersPerTable, round, eventID] = params.type;

  // Create models
  await dbConnect();
  await createParticipantsModel(eventID);
  await createVerificationsModel(eventID);
  const Participants = mongoose.models[`Participanti_live_${eventID}`];
  const Verifications = mongoose.models[`Verificari_live_${eventID}`];

  const participantsNumber = await Participants.countDocuments();
  if (participantsNumber < 4) {
    return NextResponse.json({
      success: false,
      message: "Nu sunt minim 4 înscriși",
    });
  }

  await Verifications.updateOne({ round: 0 }, { stop: true }, { upsert: true });
  const participants = await Participants.find();
  await Verifications.insertMany(participants);

  const randomParticipants = participants.sort(() => Math.random() - 0.5);

  await createMatchesModel(eventID, round);
  await createClasamentModel(eventID);
  const Matches = mongoose.models[`Meciuri_live_${eventID}_${round}`];
  const Clasament = mongoose.models[`Clasament_live_${eventID}`];

  await createMatches(
    type,
    participantsNumber,
    playersPerTable,
    Matches,
    randomParticipants,
    eventID
  );

  await Clasament.insertMany(randomParticipants);

  await Verifications.updateOne({ round: 0 }, { round: 1 });

  // Send emails to all participants
  randomParticipants
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

  // Save participants in old_participants
  const event = await Event.findById(eventID).select("title");

  const oldEvent = {
    name: event.title,
    data: participants.map((participant) => ({
      name: participant.name,
      tel: participant.tel,
      email: participant.email,
    })),
  };
  await OldParticipants.create(oldEvent);

  return NextResponse.json({ success: true });
}

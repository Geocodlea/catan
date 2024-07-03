import dbConnect from "/utils/dbConnect";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { emailFooter } from "@/utils/emailFooter";

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
  await createMatchesModel(eventID, round);
  await createClasamentModel(eventID);
  const Participants = mongoose.models[`Participanti_live_${eventID}`];
  const Verifications = mongoose.models[`Verificari_live_${eventID}`];
  const Matches = mongoose.models[`Meciuri_live_${eventID}_${round}`];
  const Clasament = mongoose.models[`Clasament_live_${eventID}`];

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

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Send emails to all participants
  randomParticipants
    .filter((participant) => participant.email)
    .forEach(async (participant) => {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: participant.email,
        subject: `Concurs Catan`,
        text: `Start runda ${round} ${emailFooter}`,
      });
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

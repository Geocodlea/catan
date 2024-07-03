import dbConnect from "/utils/dbConnect";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { emailFooter } from "@/utils/emailFooter";

import * as Participants from "@/models/Participants";
import * as Verifications from "@/models/Verifications";
import * as Matches from "@/models/Matches";
import * as Clasament from "@/models/Clasament";
import Event from "@/models/Event";
import OldParticipants from "@/models/OldParticipants";

import { createMatches } from "@/utils/createMatches";

export async function POST(request, { params }) {
  const [type, playersPerTable, round, eventID] = params.type;

  const ParticipantType = Participants[`Participanti_live_${type}`];
  const VerificationsType = Verifications[`Verificari_live_${type}`];
  const MatchesType = Matches[`Meciuri_live_${type}_${round}`];
  const ClasamentType = Clasament[`Clasament_live_${type}`];

  await dbConnect();
  const participantsNumber = await ParticipantType.countDocuments();
  if (participantsNumber < 4) {
    return NextResponse.json({
      success: false,
      message: "Nu sunt minim 4 înscriși",
    });
  }

  await VerificationsType.updateOne(
    { round: 0 },
    { stop: true },
    { upsert: true }
  );
  const participants = await ParticipantType.find();
  await VerificationsType.insertMany(participants);

  const randomParticipants = participants.sort(() => Math.random() - 0.5);

  await createMatches(
    type,
    participantsNumber,
    playersPerTable,
    MatchesType,
    randomParticipants
  );

  await ClasamentType.insertMany(randomParticipants);

  await VerificationsType.updateOne({ round: 0 }, { round: 1 });

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

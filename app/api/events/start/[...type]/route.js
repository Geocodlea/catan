import dbConnect from "/utils/dbConnect";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

import * as Participants from "@/models/Participants";
import * as Verifications from "@/models/Verifications";
import * as Matches from "@/models/Matches";
import * as Clasament from "@/models/Clasament";

import { createMatches } from "@/utils/createMatches";

export async function POST(request, { params }) {
  const [eventType, playersPerTable, round] = params.type;

  const ParticipantType = Participants[`Participanti_live_${eventType}`];
  const VerificationsType = Verifications[`Verificari_live_${eventType}`];
  const MatchesType = Matches[`Meciuri_live_${eventType}_${round}`];
  const ClasamentType = Clasament[`Clasament_live_${eventType}`];

  await dbConnect();
  const participantsNumber = await ParticipantType.countDocuments();
  if (participantsNumber < 4) {
    return NextResponse.json({
      success: false,
      message: "Nu sunt minim 4 înscriși",
    });
  }

  if (
    participantsNumber === 7 &&
    (eventType === "whist" || eventType === "rentz")
  ) {
    return NextResponse.json({
      success: false,
      message: "Nu este posibil start cu 7 participanți",
    });
  }

  // DE STERS LA FINAL !!!
  await VerificationsType.deleteMany();
  await VerificationsType.updateOne(
    { round: 0 },
    { stop: true },
    { upsert: true }
  );
  const participants = await ParticipantType.find();
  await VerificationsType.insertMany(participants);

  const randomParticipants = participants.sort(() => Math.random() - 0.5);

  await createMatches(
    eventType,
    participantsNumber,
    playersPerTable,
    MatchesType,
    randomParticipants
  );

  // DE STERS LA FINAL !!!
  await ClasamentType.deleteMany();
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
        subject: `Concurs ${eventType}`,
        text: `Start runda ${round}`,
      });
    });

  return NextResponse.json({ success: true });
}

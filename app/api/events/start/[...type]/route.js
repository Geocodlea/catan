import dbConnect from "/utils/dbConnect";
import { NextResponse } from "next/server";
import * as Participants from "@/models/Participants";
import * as Verifications from "@/models/Verifications";
import * as Matches from "@/models/Matches";

import { createMatches } from "@/utils/createMatches";

export async function POST(request, { params }) {
  const eventType = params.type[0];
  const playersPerTable = params.type[1];
  const round = params.type[2];

  const ParticipantType = Participants[`Participanti_live_${eventType}`];
  const VerificationsType = Verifications[`Verificari_live_${eventType}`];
  const MatchesType = Matches[`Meciuri_live_${eventType}_${round}`];

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
    { runda: 0 },
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

  return NextResponse.json({ success: true });
}

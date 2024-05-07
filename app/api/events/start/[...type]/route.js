import dbConnect from "/utils/dbConnect";
import { NextResponse } from "next/server";
import * as Participants from "@/models/Participants";
import * as Verifications from "@/models/Verifications";
import * as Matches from "@/models/Matches";
import {
  playersPerTableCatan,
  playersPerTableWhist,
} from "@/utils/playersPerTable";

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

  // Function to create and save a new match document
  const insertParticipant = async (table, id, name) => {
    const newParticipant = new MatchesType({
      table,
      id,
      name,
    });
    await newParticipant.save();
  };

  if (eventType === "catan" || eventType === "cavaleri") {
    // DE STERS LA FINAL !!!
    await MatchesType.deleteMany();

    // Number of 4-player tables
    const tables4 = playersPerTableCatan(participantsNumber);

    // Number of 3-player tables
    const tables3 = (participantsNumber - tables4 * 4) / 3;

    // Distribute players into 4-player tables
    await Promise.all(
      randomParticipants
        .filter((_, i) => i < tables4 * 4)
        .map(({ id, name }, i) =>
          insertParticipant(Math.floor(i / 4) + 1, id, name)
        )
    );

    // Distribute remaining players into 3-player tables
    await Promise.all(
      randomParticipants
        .filter((_, i) => i >= tables4 * 4 && i < tables4 * 4 + tables3 * 3)
        .map(({ id, name }, i) =>
          insertParticipant(Math.floor(i / 3) + 1 + tables4, id, name)
        )
    );
  }

  // Whist and Rentz
  const tables = playersPerTableWhist(participantsNumber, playersPerTable);
  console.log(tables);

  return NextResponse.json({ success: true });
}

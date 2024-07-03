import dbConnect from "/utils/dbConnect";
import { NextResponse } from "next/server";

import mongoose from "mongoose";
import {
  createParticipantsModel,
  createVerificationsModel,
  createMatchesModel,
  createClasamentModel,
} from "@/utils/createModels";

export async function GET(request, { params }) {
  const [type, eventID] = params.type;

  // Create models
  await dbConnect();
  await createParticipantsModel(eventID);
  const Participants = mongoose.models[`Participanti_live_${eventID}`];

  const participants = await Participants.find()
    .select("id name tel email obs rude")
    .sort("_id");

  return NextResponse.json(participants);
}

export async function POST(request, { params }) {
  const [type, round, eventID] = params.type;
  const data = await request.json();

  if (!data.name) {
    return NextResponse.json({
      success: false,
      message: "Numele este obligatoriu",
    });
  }

  // Create models
  await dbConnect();
  await createParticipantsModel(eventID);
  const Participants = mongoose.models[`Participanti_live_${eventID}`];

  const participant = new Participants(data);
  await participant.save();

  if (round !== "0") {
    await createVerificationsModel(eventID);
    await createMatchesModel(eventID);
    await createClasamentModel(eventID);
    const Verifications = mongoose.models[`Verificari_live_${eventID}`];
    const Matches = mongoose.models[`Meciuri_live_${eventID}_${round}`];
    const Clasament = mongoose.models[`Clasament_live_${eventID}`];

    const participantMatch = new Matches(data);
    await participantMatch.save();
    const participantClasament = new Clasament(data);
    await participantClasament.save();
    const participantVerification = new Verifications({ id: data.id });
    await participantVerification.save();
  }

  return NextResponse.json({ success: true });
}

export async function PUT(request, { params }) {
  const [type, round, eventID, id] = params.type;
  const data = await request.json();

  if (!data.name) {
    return NextResponse.json({
      success: false,
      message: "Numele este obligatoriu",
    });
  }

  // Create models
  await dbConnect();
  await createParticipantsModel(eventID);
  const Participants = mongoose.models[`Participanti_live_${eventID}`];

  await Participants.updateOne({ id }, data);

  if (round !== "0") {
    await createMatchesModel(eventID);
    await createClasamentModel(eventID);
    const Matches = mongoose.models[`Meciuri_live_${eventID}_${round}`];
    const Clasament = mongoose.models[`Clasament_live_${eventID}`];

    await Matches.updateOne({ id }, data);
    await Clasament.updateOne({ id }, data);
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request, { params }) {
  const [type, round, eventID, id] = params.type;

  // Create models
  await dbConnect();
  await createParticipantsModel(eventID);
  const Participants = mongoose.models[`Participanti_live_${eventID}`];

  await Participants.deleteOne({ id });

  if (round !== "0") {
    await createMatchesModel(eventID);
    const Matches = mongoose.models[`Meciuri_live_${eventID}_${round}`];

    await Matches.deleteOne({ id });
  }

  return NextResponse.json({ success: true });
}

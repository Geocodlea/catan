import dbConnect from "/utils/dbConnect";
import { NextResponse } from "next/server";
import OldEvents from "@/models/OldEvents";
import Event from "@/models/Event";

import mongoose from "mongoose";
import {
  createParticipantsModel,
  createVerificationsModel,
  createMatchesModel,
  createClasamentModel,
} from "@/utils/createModels";

import { sortOrder } from "@/utils/helpers";

import { Storage } from "@google-cloud/storage";

// Set up Google Cloud Storage client
const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  credentials: {
    client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
});

// Google Cloud Storage bucket name
const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME;
const bucket = storage.bucket(bucketName);

export async function DELETE(request, { params }) {
  const [type, round, isFinalRound, eventID] = params.type;

  // Create models
  await dbConnect();
  await createParticipantsModel(eventID);
  await createVerificationsModel(eventID);
  await createClasamentModel(eventID);
  await createMatchesModel(eventID, round);
  const Participants = mongoose.models[`Participanti_live_${eventID}`];
  const Verifications = mongoose.models[`Verificari_live_${eventID}`];
  const Clasament = mongoose.models[`Clasament_live_${eventID}`];
  let Matches = mongoose.models[`Meciuri_live_${eventID}_${round}`];

  if (isFinalRound === "true") {
    const roundScores = await Matches.find({
      score: null,
    }).count();
    const allScoresSubmitted = roundScores === 0;
    if (!allScoresSubmitted) {
      return NextResponse.json({
        success: false,
        message: "Nu sunt introduse toate scorurile",
      });
    }
    const participants = await Clasament.find().sort(sortOrder(type));
    // Create old event
    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const oldEventName = `clasament_live_${type}_${day}.${month}.${year}`;
    const oldEvent = {
      name: oldEventName,
      data: participants.map((participant) => ({
        id: participant.id,
        nume: participant.name,
        masar1: participant.masar1 || null,
        masar2: participant.masar2 || null,
        masar3: participant.masar3 || null,
        puncter1: participant.puncter1 || null,
        puncter2: participant.puncter2 || null,
        puncter3: participant.puncter3 || null,
        punctetotal: participant.punctetotal || null,
        punctejocr1: participant.scorjocr1 || null,
        punctejoctotalr1: participant.scortotalr1 || null,
        punctejocr2: participant.scorjocr2 || null,
        punctejoctotalr2: participant.scortotalr2 || null,
        punctejocr3: participant.scorjocr3 || null,
        punctejoctotalr3: participant.scortotalr3 || null,
        punctejoctotal: participant.scorjocuri || null,
        punctejocuri: participant.scortotal || null,
        procent: participant.procent || null,
        licitari: participant.licitari || null,
      })),
    };
    await OldEvents.create(oldEvent);
    await Clasament.collection.drop();

    // Delete matches
    for (let i = 1; i <= round; i++) {
      await createMatchesModel(eventID, i);
      Matches = mongoose.models[`Meciuri_live_${eventID}_${i}`];

      await Matches.collection.drop();
    }

    // List all files for deleted event
    const [files] = await bucket.getFiles({
      prefix: `uploads/events/${eventID}/`,
    });
    // Delete each file
    await Promise.all(
      files.map(async (file) => {
        await file.delete();
      })
    );
    await Event.deleteOne({ _id: eventID });
  }

  await Participants.deleteMany();
  await Verifications.deleteMany({ round: { $exists: false } });
  await Verifications.updateOne(
    { round: { $exists: true } },
    { round: 0, stop: false }
  );

  return NextResponse.json({ success: true });
}

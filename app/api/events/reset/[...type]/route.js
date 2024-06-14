import dbConnect from "/utils/dbConnect";
import { NextResponse } from "next/server";
import * as Participants from "@/models/Participants";
import * as Verifications from "@/models/Verifications";
import * as Matches from "@/models/Matches";
import * as Clasament from "@/models/Clasament";
import OldEvents from "@/models/OldEvents";
import Leaderboard from "@/models/Leaderboard";

import { sortOrder } from "@/utils/sortRanking";

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

// Function to drop Matches based on type
const dropMatches = async (type) => {
  // Get all keys from the Matches object
  const allKeys = Object.keys(Matches);

  // Filter keys based on the specified type
  const filteredKeys = allKeys.filter((key) => key.includes(type));

  // Drop each filtered collection
  for (const key of filteredKeys) {
    await Matches[key].collection.drop();
  }
};

export async function DELETE(request, { params }) {
  const [type, round, isFinalRound, eventID] = params.type;

  const ParticipantType = Participants[`Participanti_live_${type}`];
  const VerificationsType = Verifications[`Verificari_live_${type}`];
  const MatchesType = Matches[`Meciuri_live_${type}_${round}`];
  const ClasamentType = Clasament[`Clasament_live_${type}`];

  await dbConnect();

  if (isFinalRound === "true") {
    const roundScores = await MatchesType.find({
      score: null,
    }).count();
    const allScoresSubmitted = roundScores === 0;

    if (!allScoresSubmitted) {
      return NextResponse.json({
        success: false,
        message: "Nu sunt introduse toate scorurile",
      });
    }

    const participants = await ClasamentType.find().sort(sortOrder(type));

    // Update Leaderboard
    const leaderboardPoints = [100, 70, 50, 35, 25];
    participants.forEach(async (participant, i) => {
      const id = participant.id;
      const leaderboardParticipant = await Leaderboard.findOne({
        id,
      }).select("puncte");

      if (leaderboardParticipant) {
        await Leaderboard.updateOne(
          { id },
          {
            puncte: leaderboardParticipant.puncte + leaderboardPoints[i] || 0,
          }
        );
      } else {
        await Leaderboard.create({
          id,
          nume: participant.name,
          puncte: leaderboardPoints[i] || 0,
        });
      }
    });

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

    await ClasamentType.collection.drop();
    await dropMatches(type);

    // List all files for deleted matches
    const [files] = await bucket.getFiles({
      prefix: `uploads/events/${eventID}/matches/`,
    });

    // Delete each file
    await Promise.all(
      files.map(async (file) => {
        await file.delete();
      })
    );
  }

  await ParticipantType.deleteMany();
  await VerificationsType.deleteMany({ round: { $exists: false } });
  await VerificationsType.updateOne(
    { round: { $exists: true } },
    { round: 0, stop: false }
  );

  return NextResponse.json({ success: true });
}

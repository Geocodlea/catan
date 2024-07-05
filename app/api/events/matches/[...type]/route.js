import { NextResponse } from "next/server";
import dbConnect from "/utils/dbConnect";

import mongoose from "mongoose";
import {
  createParticipantsModel,
  createVerificationsModel,
  createMatchesModel,
  createClasamentModel,
} from "@/utils/createModels";

import { calculateScores } from "@/utils/calculateScores";
import { getMatches } from "@/utils/getMatches";

export async function GET(request, { params }) {
  const [type, round, eventID] = params.type;

  if (round === "undefined") return NextResponse.json({});

  // Create models
  await dbConnect();
  await createVerificationsModel(eventID);
  const Verifications = mongoose.models[`Verificari_live_${eventID}`];

  const matches = await getMatches(type, round, eventID);
  const allMatches = [matches];

  // Get past rounds matches
  let matches1, matches2;
  if (round === "2") {
    matches1 = await getMatches(type, 1, eventID);
    allMatches.push(matches1);
  }
  if (round === "3") {
    matches1 = await getMatches(type, 1, eventID);
    matches2 = await getMatches(type, 2, eventID);
    allMatches.push(matches2, matches1);
  }

  const verification = await Verifications.findOne().select("timer");
  const timer = verification?.timer;

  return NextResponse.json({ allMatches, timer });
}

export async function POST(request, { params }) {
  const [type, round, , , , eventID] = params.type;

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
  await createVerificationsModel(eventID);
  await createMatchesModel(eventID, round);
  await createClasamentModel(eventID);
  const Participants = mongoose.models[`Participanti_live_${eventID}`];
  const Verifications = mongoose.models[`Verificari_live_${eventID}`];
  const Matches = mongoose.models[`Meciuri_live_${eventID}_${round}`];
  const Clasament = mongoose.models[`Clasament_live_${eventID}`];

  const participant = new Participants(data);
  await participant.save();
  const participantMatch = new Matches(data);
  await participantMatch.save();
  const participantClasament = new Clasament(data);
  await participantClasament.save();
  const participantVerification = new Verifications({ id: data.id });
  await participantVerification.save();

  return NextResponse.json({ success: true });
}

export async function PUT(request, { params }) {
  const [type, round, host, isAdmin, isOrganizer, eventID, id] = params.type;
  const data = await request.json();
  const table = data.table;
  const name = data.name;

  if (typeof data.score !== "number") {
    return NextResponse.json({
      success: false,
      message: "Scorul trebuie să fie un număr",
    });
  }

  const score = Number(data.score);

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

  if (isAdmin !== "true" && isOrganizer !== "true") {
    const eventFinished = await Verifications.findOne({ stop: false });
    if (eventFinished) {
      return NextResponse.json({
        success: false,
        message: "Evenimentul este încheiat",
      });
    }
  }

  // Update the score and find if all scores are filled
  await Participants.updateOne({ id }, { name });
  await Matches.updateOne({ id }, { table, name, score, host });
  const tableScores = await Matches.find({
    table,
    score: null,
  });
  if (tableScores.length) {
    return NextResponse.json({ success: true });
  }

  // Find all players in the table
  const players = await Matches.find({
    table,
  })
    .select("id name score")
    .sort({ score: -1 });

  const ids = players.map((player) => player.id);
  const names = players.map((player) => player.name);
  const scores = players.map((player) => player.score);
  const totalScore = scores.reduce((a, b) => a + b, 0);

  const points = calculateScores(type, scores);

  // Update verifications only for catan and cavaleri
  const reducedTable = players.length === 3;
  if (type === "catan" || type === "cavaleri") {
    await Verifications.updateMany({ id: { $in: ids } }, [
      {
        $set: {
          [`meci${round}`]: table,
          masa_redusa: reducedTable,
        },
      },
    ]);
  }

  await Clasament.updateMany({ id: { $in: ids } }, [
    {
      $set: {
        name: {
          $arrayElemAt: [names, { $indexOfArray: [ids, "$id"] }],
        },
        [`masar${round}`]: table,
        [`puncter${round}`]: {
          $arrayElemAt: [points, { $indexOfArray: [ids, "$id"] }],
        },
        [`scorjocr${round}`]: {
          $arrayElemAt: [scores, { $indexOfArray: [ids, "$id"] }],
        },
        [`scortotalr${round}`]: totalScore,
      },
    },
  ]);

  await Clasament.updateMany({ id: { $in: ids } }, [
    {
      $set: {
        punctetotal: {
          $add: [
            { $ifNull: ["$puncter1", 0] },
            { $ifNull: ["$puncter2", 0] },
            { $ifNull: ["$puncter3", 0] },
          ],
        },
        scorjocuri: {
          $add: [
            { $ifNull: ["$scorjocr1", 0] },
            { $ifNull: ["$scorjocr2", 0] },
            { $ifNull: ["$scorjocr3", 0] },
          ],
        },
        scortotal: {
          $add: [
            { $ifNull: ["$scortotalr1", 0] },
            { $ifNull: ["$scortotalr2", 0] },
            { $ifNull: ["$scortotalr3", 0] },
          ],
        },
        procent: {
          $trunc: [
            {
              $multiply: [
                {
                  $add: [
                    {
                      $divide: [
                        { $ifNull: ["$scorjocr1", 0] },
                        { $ifNull: ["$scortotalr1", 1] }, // Avoid division by zero by defaulting to 1
                      ],
                    },
                    {
                      $divide: [
                        { $ifNull: ["$scorjocr2", 0] },
                        { $ifNull: ["$scortotalr2", 1] },
                      ],
                    },
                    {
                      $divide: [
                        { $ifNull: ["$scorjocr3", 0] },
                        { $ifNull: ["$scortotalr3", 1] },
                      ],
                    },
                  ],
                },
                100, // Multiply by 100
              ],
            },
            2, // Number of decimal places
          ],
        },
      },
    },
  ]);

  return NextResponse.json({ success: true });
}

export async function DELETE(request, { params }) {
  const [type, round, , , , eventID, id] = params.type;

  // Create models
  await dbConnect();
  await createParticipantsModel(eventID);
  await createMatchesModel(eventID, round);
  const Participants = mongoose.models[`Participanti_live_${eventID}`];
  const Matches = mongoose.models[`Meciuri_live_${eventID}_${round}`];

  await Participants.deleteOne({ id });
  await Matches.deleteOne({ id });

  return NextResponse.json({ success: true });
}

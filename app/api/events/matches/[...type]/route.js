import { NextResponse } from "next/server";
import dbConnect from "/utils/dbConnect";
import * as Matches from "/models/Matches";
import * as Verifications from "@/models/Verifications";
import * as Clasament from "/models/Clasament";

import { calculateScores } from "@/utils/calculateScores";

export async function GET(request, { params }) {
  const [type, round] = params.type;

  const MatchType = Matches[`Meciuri_live_${type}_${round}`];
  const VerificationsType = Verifications[`Verificari_live_${type}`];

  await dbConnect();
  const matches = await MatchType.aggregate([
    {
      $group: {
        _id: "$table",
        participants: {
          $push: {
            id: "$id",
            table: "$table",
            name: "$name",
            score: "$score",
            host: "$host",
            img: "$img",
          },
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ]);

  const verification = await VerificationsType.findOne().select("timer");
  const timer = verification.timer;

  return NextResponse.json({ matches, timer });
}

export async function PUT(request, { params }) {
  const [type, round, host, isAdmin, id] = params.type;
  const data = await request.json();
  const table = data.table;
  const name = data.name;

  if (isNaN(data.score) || !data.score) {
    return NextResponse.json({
      success: false,
      message: "Scorul trebuie să fie un număr",
    });
  }

  const score = Number(data.score);
  const MatchType = Matches[`Meciuri_live_${type}_${round}`];
  const VerificationsType = Verifications[`Verificari_live_${type}`];
  const ClasamentType = Clasament[`Clasament_live_${type}`];

  await dbConnect();

  if (isAdmin !== "true") {
    const eventFinished = await VerificationsType.findOne({ stop: false });
    if (eventFinished) {
      return NextResponse.json({
        success: false,
        message: "Evenimentul este încheiat",
      });
    }
  }

  // Update the score and find if all scores are filled
  await MatchType.updateOne({ id }, { table, name, score, host });
  const tableScores = await MatchType.find({
    table,
    score: null,
  });
  if (tableScores.length) {
    return NextResponse.json({ success: true });
  }

  // Find all players in the table
  const players = await MatchType.find({
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
    await VerificationsType.updateMany({ id: { $in: ids } }, [
      {
        $set: {
          [`meci${round}`]: table,
          masa_redusa: reducedTable,
        },
      },
    ]);
  }

  await ClasamentType.updateMany({ id: { $in: ids } }, [
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

  // Whist - different ranking
  if (type === "whist") {
    let maxScore;
    switch (players.length) {
      case 4:
        maxScore = 242;
        break;
      case 5:
        maxScore = 274;
        break;
      case 6:
        maxScore = 306;
        break;
    }

    await ClasamentType.updateMany({ id: { $in: ids } }, [
      {
        $set: {
          punctetotal: {
            $add: [
              { $ifNull: ["$puncter1", 0] },
              { $ifNull: ["$puncter2", 0] },
            ],
          },
          scorjocuri: {
            $add: [
              { $ifNull: ["$scorjocr1", 0] },
              { $ifNull: ["$scorjocr2", 0] },
            ],
          },
          scortotal: maxScore,
          procent: {
            $trunc: [
              {
                $multiply: [
                  {
                    $divide: ["$scorjocr1", maxScore],
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

  await ClasamentType.updateMany({ id: { $in: ids } }, [
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

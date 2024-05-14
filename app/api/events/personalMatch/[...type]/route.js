import { NextResponse } from "next/server";
import dbConnect from "/utils/dbConnect";
import * as Matches from "/models/Matches";
import * as Verifications from "@/models/Verifications";
import * as Clasament from "/models/Clasament";

import { v4 as uuidv4 } from "uuid";
import { Storage } from "@google-cloud/storage";
import { calculateScores } from "@/utils/calculateScores";

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

export async function GET(request, { params }) {
  const [type, round, userID] = params.type;

  const MatchType = Matches[`Meciuri_live_${type}_${round}`];

  await dbConnect();
  // Find the table value associated with the given userID
  const user = await MatchType.findOne({
    id: userID,
  }).select("table");

  if (!user) return NextResponse.json({});

  // Find all entries with the same "table" value
  const personalMatch = await MatchType.find({ table: user.table }).select(
    "id table name score"
  );

  return NextResponse.json(personalMatch);
}

export async function PUT(request, { params }) {
  const [type, round, host, id] = params.type;
  const data = await request.json();
  const table = data.table;

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
  const eventFinished = await VerificationsType.findOne({
    round: 0,
  });
  if (eventFinished) {
    return NextResponse.json({
      success: false,
      message: "Evenimentul este încheiat",
    });
  }

  // Update the score and find if all scores are filled
  await MatchType.updateOne({ id }, { score, host });
  const tableScores = await MatchType.find({
    table,
    score: null,
  });
  if (tableScores.length) {
    return NextResponse.json({ success: true });
  }

  const players = await MatchType.find({
    table,
  })
    .select("id score")
    .sort({ score: -1 });

  const ids = players.map((player) => player.id);
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

// Uploading scores image
export async function PATCH(request, { params }) {
  const [type, round, userID, eventID] = params.type;
  const formData = await request.formData();
  const image = formData.get("image");

  const MatchType = Matches[`Meciuri_live_${type}_${round}`];

  const bytes = await image.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create a unique filename using uuid
  const filename = `${uuidv4()}-${image.name}`;

  // GCS object (path) where the file will be stored
  const gcsObject = bucket.file(`uploads/events/${eventID}/${filename}`);

  // Create a write stream and upload the file to Google Cloud Storage
  const writeStream = gcsObject.createWriteStream({
    metadata: { contentType: image.type },
  });
  writeStream.end(buffer);

  // Update the data with the Google Cloud Storage URL
  const imageURL = `https://storage.googleapis.com/${bucketName}/${gcsObject.name}`;

  await dbConnect();
  const user = await MatchType.findOne({
    id: userID,
  }).select("table");
  await MatchType.updateMany({ table: user.table }, { img: imageURL });

  return NextResponse.json({ success: true });
}

import dbConnect from "/utils/dbConnect";
import * as Matches from "/models/Matches";
import { NextResponse } from "next/server";
import * as Verifications from "@/models/Verifications";
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
  const [id, type, round, username] = params.type;
  const data = await request.json();

  if (isNaN(data.score) || !data.score) {
    return NextResponse.json({
      success: false,
      message: "Scorul trebuie să fie un număr",
    });
  }

  const score = Number(data.score);
  const MatchType = Matches[`Meciuri_live_${type}_${round}`];
  const VerificationsType = Verifications[`Verificari_live_${type}`];

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
  await MatchType.updateOne({ id }, { score, host: username });
  const tableScores = await MatchType.find({
    table: data.table,
    score: null,
  });
  if (tableScores.length) {
    return NextResponse.json({ success: true });
  }

  const scores = await MatchType.find({
    table: data.table,
  })
    .select("score")
    .sort({ score: -1 });

  console.log(scores);

  const points = calculateScores(type, scores);

  console.log(points);

  return NextResponse.json({ success: true });
}

// Uploading scores image
export async function PATCH(request, { params }) {
  const [type, round, userID] = params.type;
  const formData = await request.formData();
  const image = formData.get("image");

  const MatchType = Matches[`Meciuri_live_${type}_${round}`];

  const bytes = await image.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create a unique filename using uuid
  const filename = `${uuidv4()}-${image.name}`;

  // GCS object (path) where the file will be stored
  const gcsObject = bucket.file(`uploads/events/${filename}`);

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

import { NextResponse } from "next/server";
import dbConnect from "/utils/dbConnect";
import * as Matches from "/models/Matches";

import { v4 as uuidv4 } from "uuid";
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

export async function GET(request, { params }) {
  const [type, round, userID] = params.type;

  const MatchesType = Matches[`Meciuri_live_${type}_${round}`];

  await dbConnect();
  // Find the table value associated with the given userID
  const user = await MatchesType.findOne({
    id: userID,
  }).select("table");

  if (!user) return NextResponse.json({});

  // Find all entries with the same "table" value
  const personalMatch = await MatchesType.find({ table: user.table }).select(
    "id table name score"
  );

  return NextResponse.json(personalMatch);
}

// Uploading scores image
export async function PATCH(request, { params }) {
  const [type, round, userID, eventID] = params.type;
  const formData = await request.formData();
  const image = formData.get("image");

  const MatchesType = Matches[`Meciuri_live_${type}_${round}`];

  const bytes = await image.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create a unique filename using uuid
  const filename = `${uuidv4()}-${image.name}`;

  // GCS object (path) where the file will be stored
  const gcsObject = bucket.file(
    `uploads/events/${eventID}/matches/${filename}`
  );

  // Create a write stream and upload the file to Google Cloud Storage
  const writeStream = gcsObject.createWriteStream({
    metadata: { contentType: image.type },
  });
  writeStream.end(buffer);

  // Update the data with the Google Cloud Storage URL
  const imageURL = `https://storage.googleapis.com/${bucketName}/${gcsObject.name}`;

  await dbConnect();
  const user = await MatchesType.findOne({
    id: userID,
  }).select("table");
  await MatchesType.updateMany({ table: user.table }, { img: imageURL });

  return NextResponse.json({ success: true });
}

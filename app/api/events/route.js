import dbConnect from "/utils/dbConnect";
import Event from "/models/Event";
import { v4 as uuidv4 } from "uuid";
import { Storage } from "@google-cloud/storage";
import { NextResponse } from "next/server";

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

export async function POST(request) {
  const formData = await request.formData();
  const data = {};

  // Get all keys and values from the FormData object
  for (const [key, value] of formData.entries()) {
    data[key] = value;
  }

  // Create a new event and obtain its ID
  await dbConnect();
  const event = new Event(data);

  const bytes = await data.image.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create a unique filename using uuid
  const filename = `${uuidv4()}-${data.image.name}`;

  // GCS object (path) where the file will be stored
  const gcsObject = bucket.file(`uploads/events/${event._id}/${filename}`);

  // Create a write stream and upload the file to Google Cloud Storage
  const writeStream = gcsObject.createWriteStream({
    metadata: { contentType: data.image.type },
  });
  writeStream.end(buffer);

  // Update the image with the Google Cloud Storage URL
  event.image = `https://storage.googleapis.com/${bucketName}/${gcsObject.name}`;

  await event.save();

  return NextResponse.json({ success: true });
}

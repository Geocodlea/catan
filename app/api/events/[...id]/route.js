import dbConnect from "/utils/dbConnect";
import Event from "/models/Event";
import { v4 as uuidv4 } from "uuid";
import { Storage } from "@google-cloud/storage";
import { NextResponse } from "next/server";

import mongoose from "mongoose";
import {
  createParticipantsModel,
  createVerificationsModel,
} from "@/utils/createModels";

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
  await dbConnect();
  const event = await Event.findOne({ _id: params.id[0] }).select(
    "detalii premii regulament organizer"
  );

  return NextResponse.json(event);
}

// Edit Event text: detalii, premii and regulament
export async function PUT(request, { params }) {
  const body = await request.json();

  await dbConnect();
  await Event.updateOne({ _id: params.id[0] }, { [body.tab]: body.data });

  return NextResponse.json({ success: true });
}

// Edit Event from homepage
export async function PATCH(request, { params }) {
  const formData = await request.formData();
  const data = {};

  // Get all keys and values from the FormData object
  for (const [key, value] of formData.entries()) {
    if (value) data[key] = value;
  }

  await dbConnect();

  if (data.image) {
    const bytes = await data.image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename using uuid
    const filename = `${uuidv4()}-${data.image.name}`;

    // GCS object (path) where the file will be stored
    const gcsObject = bucket.file(`uploads/events/${params.id}/${filename}`);

    // Create a write stream and upload the file to Google Cloud Storage
    const writeStream = gcsObject.createWriteStream({
      metadata: { contentType: data.image.type },
    });
    writeStream.end(buffer);

    // Update the data with the Google Cloud Storage URL
    data.image = `https://storage.googleapis.com/${bucketName}/${gcsObject.name}`;

    // Find old event image and delete it, before uploading the new one
    const event = await Event.findOne({ _id: params.id });

    // Remove the prefix to get only the bucket
    const imgURL = event.image.replace(
      `https://storage.googleapis.com/${bucketName}/`,
      ""
    );

    const gcsImgObject = bucket.file(imgURL);
    await gcsImgObject.delete();
  }

  await Event.updateOne({ _id: params.id }, data);

  return NextResponse.json({ success: true });
}

export async function DELETE(request, { params }) {
  const [id] = params.id;

  // Create models
  await dbConnect();
  await createParticipantsModel(id);
  await createVerificationsModel(id);
  const Participants = mongoose.models[`Participanti_live_${id}`];
  const Verifications = mongoose.models[`Verificari_live_${id}`];
  console.log(Verifications, Participants);
  const eventStarted = await Verifications.findOne({
    round: { $gt: 0 },
  });
  if (eventStarted) {
    return NextResponse.json({
      success: false,
      message: "Evenimentul este început",
    });
  }

  // List all files for deleted event
  const [files] = await bucket.getFiles({
    prefix: `uploads/events/${id}/`,
  });

  // Delete each file
  await Promise.all(
    files.map(async (file) => {
      await file.delete();
    })
  );

  await Event.deleteOne({ _id: id });
  await Participants.collection.drop();
  await Verifications.collection.drop();

  return NextResponse.json({ success: true });
}

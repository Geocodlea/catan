import dbConnect from "/utils/dbConnect";
import User from "/models/User";
import Account from "/models/Account";

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
const bucketName = "geo_bucket_1";
const bucket = storage.bucket(bucketName);

// Update user from profile
export async function PATCH(request, { params }) {
  const formData = await request.formData();
  const data = {};

  // Get all keys and values from the FormData object
  for (const [key, value] of formData.entries()) {
    if (value) data[key] = value;
  }

  if (data.image) {
    const bytes = await data.image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename using uuid
    const filename = `${uuidv4()}-${data.image.name}`;

    // GCS object (path) where the file will be stored
    const gcsObject = bucket.file(`uploads/users/${params.id}/${filename}`);

    // Create a write stream and upload the file to Google Cloud Storage
    const writeStream = gcsObject.createWriteStream({
      metadata: { contentType: data.image.type },
    });

    // Return a promise that resolves when the file upload is complete
    const uploadPromise = new Promise((resolve, reject) => {
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });

    // Pipe the buffer into the write stream
    writeStream.end(buffer);

    // Wait for the file upload to complete
    await uploadPromise;

    // Update the data with the Google Cloud Storage URL
    data.image = `https://storage.googleapis.com/${bucketName}/uploads/users/${params.id}/${filename}`;
  }

  await dbConnect();
  await User.updateOne({ _id: params.id }, data);

  return NextResponse.json({ success: true });
}

// Update user from admin
export async function PUT(request, { params }) {
  const data = await request.json();

  if (!data.name || !data.email) {
    return NextResponse.json({
      success: false,
      message: "Numele și Emailul sunt obligatorii",
    });
  }

  await dbConnect();
  const emailExists = await User.findOne({
    email: data.email,
    _id: { $ne: params.id },
  });

  if (emailExists) {
    return NextResponse.json({
      success: false,
      message: "Emailul există deja",
    });
  }

  await User.updateOne({ _id: params.id }, data);

  return NextResponse.json({ success: true });
}

export async function DELETE(request, { params }) {
  await dbConnect();
  await User.deleteOne({ _id: params.id });
  await Account.deleteMany({ userId: params.id });

  // List all files for deleted user
  const [files] = await bucket.getFiles({
    prefix: `uploads/users/${params.id}/`,
  });

  // Delete each file
  await Promise.all(
    files.map(async (file) => {
      await file.delete();
    })
  );

  return NextResponse.json({ success: true });
}

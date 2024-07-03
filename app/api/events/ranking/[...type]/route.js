import dbConnect from "/utils/dbConnect";
import { NextResponse } from "next/server";

import mongoose from "mongoose";
import { createClasamentModel } from "@/utils/createModels";

import { sortOrder } from "@/utils/helpers";

export async function GET(request, { params }) {
  const [type, round, eventID] = params.type;

  // Create models
  await dbConnect();
  await createClasamentModel(eventID);
  const Clasament = mongoose.models[`Clasament_live_${eventID}`];

  const clasament = await Clasament.find().sort(sortOrder(type, round));

  return NextResponse.json(clasament);
}

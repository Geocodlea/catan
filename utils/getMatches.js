import dbConnect from "/utils/dbConnect";
import mongoose from "mongoose";
import { createMatchesModel } from "@/utils/createModels";

export const getMatches = async (type, round, eventID) => {
  // Create models
  await dbConnect();
  await createMatchesModel(eventID, round);
  const Matches = mongoose.models[`Meciuri_live_${eventID}_${round}`];

  const matches = await Matches.aggregate([
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

  return matches;
};

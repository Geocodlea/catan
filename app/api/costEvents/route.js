import dbConnect from "/utils/dbConnect";
import OldEvents from "/models/OldEvents";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  const costEvents = await OldEvents.aggregate([
    {
      $match: {
        name: /04\.2024$/, // Filter documents that end with 'mm.yyyy'
      },
    },
    {
      $addFields: {
        nameSplit: { $split: ["$name", "_"] }, // Split the 'name' field by '_'
      },
    },
    {
      $addFields: {
        dateStr: { $arrayElemAt: ["$nameSplit", -1] }, // Extract the date string
      },
    },
    {
      $addFields: {
        date: {
          $dateFromString: {
            dateString: "$dateStr",
            format: "%d.%m.%Y",
          },
        },
      },
    },
    {
      $sort: { date: -1 }, // Sort by the extracted date
    },
    {
      $addFields: {
        participants: { $size: "$data" }, // Calculate the length of the 'data' array
      },
    },
    {
      $project: {
        participants: 1, // Project the 'participants' field
        name: 1, // Project the 'name' field
      },
    },
  ]);

  console.log(costEvents);

  return NextResponse.json(costEvents);
}

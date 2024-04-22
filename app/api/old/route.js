import dbConnect from "/utils/dbConnect";
import OldEvents from "/models/OldEvents";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  const oldEvents = await OldEvents.aggregate([
    {
      $match: {
        name: { $regex: /^clasament_/ }, // Filter documents that start with 'clasament_'
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
  ]);

  return NextResponse.json(oldEvents);
}

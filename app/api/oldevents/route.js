import dbConnect from "/utils/dbConnect";
import OldEvents from "/models/OldEvents";
import { NextResponse } from "next/server";

// Define a reusable aggregation pipeline for all events
const allEventsPipeline = [
  // {
  //   $match: {
  //     name: { $regex: /^clasament_/ }, // Filter documents that start with 'clasament_'
  //   },
  // },
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
    $project: {
      name: 1,
      participants: { $size: "$data" },
    },
  },
];

export async function GET() {
  await dbConnect();
  // Retrieve the last 10 events
  const lastEvents = await OldEvents.aggregate([
    ...allEventsPipeline,
    { $limit: 10 },
  ]);

  return NextResponse.json(lastEvents);
}

export async function POST() {
  await dbConnect();
  // Retrieve all events
  const allEvents = await OldEvents.aggregate([allEventsPipeline]);

  return NextResponse.json(allEvents);
}

import { NextResponse } from "next/server";
import dbConnect from "/utils/dbConnect";
import * as Matches from "/models/Matches";

export async function GET(request, { params }) {
  const [type, round] = params.type;

  const MatchType = Matches[`Meciuri_live_${type}_${round}`];

  await dbConnect();
  const matches = await MatchType.aggregate([
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

  return NextResponse.json(matches);
}

export async function PUT(request, { params }) {
  const [id, type, round, playerName] = params.type;
  const data = await request.json();

  console.log(params);

  return NextResponse.json({ success: true });
}

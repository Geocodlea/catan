import dbConnect from "/utils/dbConnect";
import { NextResponse } from "next/server";
import * as Participants from "@/models/Participants";
import * as Verifications from "@/models/Verifications";
import * as Matches from "@/models/Matches";
import * as Clasament from "@/models/Clasament";
import OldEvents from "@/models/OldEvents";
import Leaderboard from "@/models/Leaderboard";

import { sortOrder } from "@/utils/sortRanking";

export async function DELETE(request, { params }) {
  const [type, round, isFinalRound] = params.type;

  const ParticipantType = Participants[`Participanti_live_${type}`];
  const VerificationsType = Verifications[`Verificari_live_${type}`];
  const MatchesType = Matches[`Meciuri_live_${type}_${round}`];
  const ClasamentType = Clasament[`Clasament_live_${type}`];

  await dbConnect();

  if (isFinalRound) {
    const roundScores = await MatchesType.find({
      score: null,
    }).count();
    const allScoresSubmitted = roundScores === 0;

    if (!allScoresSubmitted) {
      return NextResponse.json({
        success: false,
        message: "Nu sunt introduse toate scorurile",
      });
    }

    const participants = await ClasamentType.find().sort(sortOrder(type));

    // Update Leaderboard
    const leaderboardPoints = [100, 70, 50, 35, 25];
    participants.forEach(async (participant, i) => {
      const id = participant.id;
      const leaderboardParticipant = await Leaderboard.findOne({
        id,
      }).select("puncte");

      if (leaderboardParticipant) {
        await Leaderboard.updateOne(
          { id },
          {
            puncte: leaderboardParticipant.puncte + leaderboardPoints[i] || 0,
          }
        );
      } else {
        await Leaderboard.create({
          id,
          nume: participant.name,
          puncte: leaderboardPoints[i] || 0,
        });
      }
    });

    // Create old event
    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const oldEventName = `clasament_live_${type}_${day}.${month}.${year}`;

    const oldEvent = {
      name: oldEventName,
      data: participants.map((participant) => ({
        id: participant.id,
        nume: participant.name,
        masar1: participant.masar1 || null,
        masar2: participant.masar2 || null,
        masar3: participant.masar3 || null,
        puncter1: participant.puncter1 || null,
        puncter2: participant.puncter2 || null,
        puncter3: participant.puncter3 || null,
        punctetotal: participant.punctetotal || null,
        punctejocr1: participant.scorjocr1 || null,
        punctejoctotalr1: participant.scortotalr1 || null,
        punctejocr2: participant.scorjocr2 || null,
        punctejoctotalr2: participant.scortotalr2 || null,
        punctejocr3: participant.scorjocr3 || null,
        punctejoctotalr3: participant.scortotalr3 || null,
        punctejoctotal: participant.scorjocuri || null,
        punctejocuri: participant.scortotal || null,
        procent: participant.procent || null,
      })),
    };

    await OldEvents.create(oldEvent);

    return NextResponse.json({ success: true });
  }

  await ParticipantType.deleteMany();

  await VerificationsType.updateOne(
    { round: { $exists: true } },
    { stop: false, round: 0, timer: null }
  );
  await MatchesType.collection.drop();
  await ClasamentType.collection.drop();

  return NextResponse.json({ success: true });
}

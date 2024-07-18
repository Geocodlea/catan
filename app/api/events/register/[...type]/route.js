import dbConnect from "/utils/dbConnect";
import { NextResponse } from "next/server";

import {
  isSubscribed,
  transporter,
  footerText,
  footerHtml,
} from "/utils/emailHelpers";

import mongoose from "mongoose";
import {
  createParticipantsModel,
  createVerificationsModel,
} from "@/utils/createModels";

export async function POST(request, { params }) {
  const [type, eventID] = params.type;
  const session = await request.json();

  if (Object.keys(session).length === 0) {
    return NextResponse.json({ success: false, message: "Nu ești logat" });
  }

  if (!session.user.name) {
    return NextResponse.json({
      success: false,
      message: "Numele este obligatoriu",
    });
  }

  // Create models
  await dbConnect();
  await createParticipantsModel(eventID);
  await createVerificationsModel(eventID);
  const Participants = mongoose.models[`Participanti_live_${eventID}`];
  const Verifications = mongoose.models[`Verificari_live_${eventID}`];

  const eventStarted = await Verifications.findOne({
    round: { $gt: 0 },
  });
  if (eventStarted) {
    return NextResponse.json({
      success: false,
      message: "Evenimentul este început",
    });
  }

  const registeredParticipant = await Participants.findOne({
    id: session.user.id,
  });

  if (registeredParticipant) {
    return NextResponse.json({ success: false, message: "Ești deja înscris" });
  }

  const participant = new Participants(session.user);
  await participant.save();

  if (await isSubscribed(session.user.email)) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: session.user.email,
        subject: `Înscriere Catan - Etapă Locală`,
        text: `Salutare ${
          session.user.name
        }, ne bucură înscrierea ta la etapa locală de Catan. \r\n\r\n În cazul în care nu vei mai putea ajunge, te rugăm să ne anunți sau să îți anulezi înscrierea pe site: https://catan-romania.netlify.app/ \r\n\r\n Mulțumim, o zi frumoasă în continuare 😊 ${footerText(
          session.user.email
        )}`,
        html: `<p>Salutare ${session.user.name},</p>
               <p>Ne bucură înscrierea ta la etapa locală de Catan.</p>
               <p>În cazul în care nu vei mai putea ajunge, te rugăm să ne anunți sau să îți anulezi înscrierea pe <a href="https://catan-romania.netlify.app/">website</a></p>
               <p>Mulțumim, o zi frumoasă în continuare 😊</p>
               <p>${footerHtml(session.user.email)}</p>`,
      });

      return NextResponse.json({ success: true });
    } catch (error) {
      return NextResponse.json({
        success: false,
        message: "Failed to send email",
      });
    }
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request, { params }) {
  const [type, eventID] = params.type;
  const user = await request.json();

  if (Object.keys(user).length === 0) {
    return NextResponse.json({ success: false, message: "Nu ești logat" });
  }

  // Create models
  await dbConnect();
  await createParticipantsModel(eventID);
  const Participants = mongoose.models[`Participanti_live_${eventID}`];

  const registeredParticipant = await Participants.findOne({
    id: user.id,
  });
  if (!registeredParticipant) {
    return NextResponse.json({ success: false, message: "Nu ești înscris" });
  }

  await Participants.deleteOne({ id: user.id });

  return NextResponse.json({ success: true });
}

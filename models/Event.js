import mongoose from "mongoose";

global.models = global.models || {};

global.models.Event =
  global.models.Event ||
  mongoose.model("Event", {
    title: { type: String },
    description: { type: String },
    image: { type: String },
    date: { type: Date },
    type: { type: String },
    detalii: { type: String },
    premii: { type: String },
    regulament: { type: String },
    organizer: { type: String },
  });

export default global.models.Event;

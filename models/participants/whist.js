import mongoose from "mongoose";

global.models = global.models || {};

const ParticipantiLiveWhistSchema = new mongoose.Schema(
  {
    id: { type: String },
    name: { type: String },
    tel: { type: String },
    email: { type: String },
    obs: { type: String },
  },
  { collection: "participanti_live_whist" }
);

// Check if the model already exists in global.models, if not, create it
global.models.ParticipantiLiveWhist =
  global.models.ParticipantiLiveWhist ||
  mongoose.model("ParticipantiLiveWhist", ParticipantiLiveWhistSchema);

export default global.models.ParticipantiLiveWhist;

import mongoose from "mongoose";

global.models = global.models || {};

const ParticipantiLiveCavaleriSchema = new mongoose.Schema(
  {
    id: { type: String },
    name: { type: String },
    tel: { type: String },
    email: { type: String },
    obs: { type: String },
  },
  { collection: "participanti_live_cavaleri" }
);

// Check if the model already exists in global.models, if not, create it
global.models.ParticipantiLiveCavaleri =
  global.models.ParticipantiLiveCavaleri ||
  mongoose.model("ParticipantiLiveCavaleri", ParticipantiLiveCavaleriSchema);

export default global.models.ParticipantiLiveCavaleri;

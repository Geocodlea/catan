import mongoose from "mongoose";

global.models = global.models || {};

global.models.User =
  global.models.User ||
  mongoose.model("User", {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    emailVerified: { type: Date },
    role: { type: String },
    tel: { type: String },
  });

export default global.models.User;

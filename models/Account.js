import mongoose from "mongoose";

global.models = global.models || {};

global.models.Account =
  global.models.Account ||
  mongoose.model("Account", {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // Optional: specify the model that this ObjectId refers to
    },
  });

export default global.models.Account;

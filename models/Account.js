import mongoose from "mongoose";

global.models = global.models || {};

global.models.Account = global.models.Account || mongoose.model("Account", {});

export default global.models.Account;

import mongoose from "mongoose";

const createParticipantsModel = (event) => {
  const schema = new mongoose.Schema(
    {
      id: { type: String, required: true },
      name: { type: String, required: true },
      tel: { type: String },
      email: { type: String },
      obs: { type: String },
      rude: { type: String },
    },
    { collection: `participanti_live_${event}` }
  );

  const modelName = `Participanti_live_${event}`;
  global.models[modelName] =
    global.models[modelName] || mongoose.model(modelName, schema);

  return global.models[modelName];
};

const createVerificationsModel = (event) => {
  const schema = new mongoose.Schema(
    {
      id: { type: String },
      round: { type: Number },
      stop: { type: Boolean },
      timer: { type: Date },
      meci1: { type: String },
      meci2: { type: String },
      rude: { type: String },
      masa_redusa: { type: Boolean },
    },
    { collection: `verificari_live_${event}` }
  );

  const modelName = `Verificari_live_${event}`;
  global.models[modelName] =
    global.models[modelName] || mongoose.model(modelName, schema);

  return global.models[modelName];
};

const createMatchesModel = (event, round) => {
  const schema = new mongoose.Schema(
    {
      id: { type: String },
      table: { type: Number },
      name: { type: String },
      score: { type: Number },
      host: { type: String },
      img: { type: String },
    },
    { collection: `meciuri_live_${event}_${round}` }
  );

  const modelName = `Meciuri_live_${event}_${round}`;
  global.models[modelName] =
    global.models[modelName] || mongoose.model(modelName, schema);

  return global.models[modelName];
};

const createClasamentModel = (event) => {
  const schema = new mongoose.Schema(
    {
      id: { type: String, required: true },
      name: { type: String, required: true },
      masar1: { type: Number },
      masar2: { type: Number },
      masar3: { type: Number },
      puncter1: { type: Number },
      puncter2: { type: Number },
      puncter3: { type: Number },
      punctetotal: { type: Number },
      scorjocr1: { type: Number },
      scortotalr1: { type: Number },
      scorjocr2: { type: Number },
      scortotalr2: { type: Number },
      scorjocr3: { type: Number },
      scortotalr3: { type: Number },
      scorjocuri: { type: Number },
      scortotal: { type: Number },
      procent: { type: Number },
    },
    { collection: `clasament_live_${event}` }
  );

  const modelName = `Clasament_live_${event}`;
  global.models[modelName] =
    global.models[modelName] || mongoose.model(modelName, schema);

  return global.models[modelName];
};

export {
  createParticipantsModel,
  createVerificationsModel,
  createMatchesModel,
  createClasamentModel,
};

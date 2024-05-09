import { createClasamentModel } from "@/utils/createModels";

global.models = global.models || {};

const Clasament_live_catan = createClasamentModel("catan");
const Clasament_live_cavaleri = createClasamentModel("cavaleri");
const Clasament_live_rentz = createClasamentModel("rentz");
const Clasament_live_whist = createClasamentModel("whist");

export {
  Clasament_live_catan,
  Clasament_live_cavaleri,
  Clasament_live_rentz,
  Clasament_live_whist,
};

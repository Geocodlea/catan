import { createAmicalModel } from "@/utils/createModels";

global.models = global.models || {};

const Amical_live_catan = createAmicalModel("catan");
const Amical_live_cavaleri = createAmicalModel("cavaleri");
const Amical_live_rentz = createAmicalModel("rentz");
const Amical_live_whist = createAmicalModel("whist");

export {
  Amical_live_catan,
  Amical_live_cavaleri,
  Amical_live_rentz,
  Amical_live_whist,
};

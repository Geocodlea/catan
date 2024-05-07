import { createMatchesModel } from "@/utils/createModels";

global.models = global.models || {};

const Meciuri_live_catan_1 = createMatchesModel("catan", 1);
const Meciuri_live_catan_2 = createMatchesModel("catan", 2);
const Meciuri_live_catan_3 = createMatchesModel("catan", 3);

const Meciuri_live_cavaleri_1 = createMatchesModel("cavaleri", 1);
const Meciuri_live_cavaleri_2 = createMatchesModel("cavaleri", 2);

const Meciuri_live_rentz_1 = createMatchesModel("rentz", 1);

const Meciuri_live_whist_1 = createMatchesModel("whist", 1);
const Meciuri_live_whist_2 = createMatchesModel("whist", 2);

export {
  Meciuri_live_catan_1,
  Meciuri_live_catan_2,
  Meciuri_live_catan_3,
  Meciuri_live_cavaleri_1,
  Meciuri_live_cavaleri_2,
  Meciuri_live_rentz_1,
  Meciuri_live_whist_1,
  Meciuri_live_whist_2,
};

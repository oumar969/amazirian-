export type Governorate =
  | "Damaskus (دمشق)"
  | "Rif Dimashq (ريف دمشق)"
  | "Aleppo (حلب)"
  | "Homs (حمص)"
  | "Hama (حماة)"
  | "Latakia (اللاذقية)"
  | "Tartus (طرطوس)"
  | "Idlib (إدلب)"
  | "Daraa (درعا)"
  | "As-Suwayda (السويداء)"
  | "Quneitra (القنيطرة)"
  | "Deir ez-Zor (دير الزور)"
  | "Ar-Raqqah (الرقة)"
  | "Al-Hasakah (الحسكة)";

export const governorateFeesSyp: Record<Governorate, number> = {
  "Damaskus (دمشق)": 10000,
  "Rif Dimashq (ريف دمشق)": 15000,
  "Aleppo (حلب)": 22000,
  "Homs (حمص)": 18000,
  "Hama (حماة)": 18000,
  "Latakia (اللاذقية)": 24000,
  "Tartus (طرطوس)": 24000,
  "Idlib (إدلب)": 26000,
  "Daraa (درعا)": 22000,
  "As-Suwayda (السويداء)": 22000,
  "Quneitra (القنيطرة)": 24000,
  "Deir ez-Zor (دير الزور)": 32000,
  "Ar-Raqqah (الرقة)": 32000,
  "Al-Hasakah (الحسكة)": 35000,
};

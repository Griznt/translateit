const API_URL = "/api/v1/";
export const TRANSLATE_API_URL = `${API_URL}translate`;
export const SEND_TO_HUMAN_API_URL = `${API_URL}send-to-human`;
export const APP_CONFIG_API_URL = `/app`;
export const ACCEPTED_FILE_EXTENSIONS = [".txt", ".md"];
export const LANGUAGES = {
  EN: "English",
  DE: "German",
  FR: "French",
  ES: "Spanish",
  IT: "Italian",
  NL: "Dutch",
  PL: "Polish"
};
export const EMAIL_REGEXP = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
export const WORD_REGEXP = /[\w\d]+/g;

export const ONE_WORD_PRICE = 0.1;
export const START_PRICE = 25;

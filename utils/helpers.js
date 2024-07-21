const FILE_SIZE = 10000000; // 10 MB
const FILE_SIZE_TEXT = "File size is too large, max 10 MB";
const SUPPORTED_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/gif",
  "image/png",
  "image/webp",
];
const SUPPORTED_FORMATS_TEXT =
  "Unsupported file type, accepted formats: jpg, jpeg, gif, png, webp";

const sortOrder = (type, round) => {
  if (type === "whist") {
    return round === 1
      ? { punctetotal: -1, procent: -1 }
      : { puncter2: -1, licitari: -1 };
  }

  return { punctetotal: -1, scorjocuri: -1, procent: -1 };
};

const gameName = (eventName) => {
  // Split the string into two parts, using the last underscore as the separator
  let parts = eventName.split(/_(?=[^_]+$)/);
  return parts[0];
};

// Old Events Date
const oldEventsDate = () => {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
};

export {
  FILE_SIZE,
  FILE_SIZE_TEXT,
  SUPPORTED_FORMATS,
  SUPPORTED_FORMATS_TEXT,
  sortOrder,
  gameName,
  oldEventsDate,
};

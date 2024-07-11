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

export { sortOrder, gameName, oldEventsDate };

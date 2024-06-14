export const sortOrder = (type, round) => {
  if (type === "whist") {
    return round === 1
      ? { punctetotal: -1, procent: -1 }
      : { puncter2: -1, licitari: -1 };
  }

  return { punctetotal: -1, scorjocuri: -1, procent: -1 };
};

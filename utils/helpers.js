export const sortOrder = (type, round) => {
  if (type === "whist") {
    return round === 1
      ? { punctetotal: -1, procent: -1 }
      : { puncter2: -1, licitari: -1 };
  }

  return { punctetotal: -1, scorjocuri: -1, procent: -1 };
};

const findGame = (item) => {
  const games = {
    catan: "Catan",
    whist: "Whist",
    rentz: "Rentz",
    cavaleri: "Catan - Orașe și Cavaleri",
  };
  for (let key in games) {
    if (item.includes(key)) {
      return games[key]; // Return the display name directly
    }
  }
  return "Unknown Game"; // Directly handle unknown game case here
};

export const gameName = (event) => {
  const isOnline = event.name.includes("online");
  const isLive = event.name.includes("live");
  const mode = isOnline ? "online" : isLive ? "live" : "Campionat Național";
  const game = findGame(event.name);

  return `${game} - ${mode}`;
};

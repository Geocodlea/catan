export const sortOrder = (type) =>
  type === "whist"
    ? { puncter2: -1, scortotal: -1, procent: -1 }
    : { punctetotal: -1, scortotal: -1, procent: -1 };

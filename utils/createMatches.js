import { playersPerTableCatan, playersPerTableWhist } from "./playersPerTable";

// Create and save a new match document
const insertParticipant = async (Matches, table, id, name) => {
  const newParticipant = new Matches({
    table,
    id,
    name,
  });
  await newParticipant.save();
};

export const createMatches = async (
  type,
  participantsNumber,
  playersPerTable,
  Matches,
  participants,
  eventID
) => {
  if (type === "catan" || type === "cavaleri") {
    // Number of 4-player tables
    const tables4 = playersPerTableCatan(participantsNumber);

    // Number of 3-player tables
    const tables3 = (participantsNumber - tables4 * 4) / 3;

    // Distribute players into 4-player tables
    await Promise.all(
      participants
        .filter((_, i) => i < tables4 * 4)
        .map(({ id, name }, i) =>
          insertParticipant(Matches, Math.floor(i / 4) + 1, id, name)
        )
    );

    // Distribute remaining players into 3-player tables
    await Promise.all(
      participants
        .filter((_, i) => i >= tables4 * 4 && i < tables4 * 4 + tables3 * 3)
        .map(({ id, name }, i) =>
          insertParticipant(Matches, Math.floor(i / 3) + 1 + tables4, id, name)
        )
    );
  }

  if (type === "whist" || type === "rentz") {
    const tables = playersPerTableWhist(participantsNumber, playersPerTable);

    // Distribute players into 6-player tables
    await Promise.all(
      participants
        .filter((_, i) => i < tables.tables6 * 6)
        .map(({ id, name }, i) =>
          insertParticipant(Matches, Math.floor(i / 6) + 1, id, name)
        )
    );

    // Distribute remaining players into 5-player tables
    await Promise.all(
      participants
        .filter(
          (_, i) =>
            i >= tables.tables6 * 6 &&
            i < tables.tables6 * 6 + tables.tables5 * 5
        )
        .map(({ id, name }, i) =>
          insertParticipant(
            Matches,
            Math.floor(i / 5) + 1 + tables.tables6,
            id,
            name
          )
        )
    );

    // Distribute remaining players into 4-player tables
    await Promise.all(
      participants
        .filter(
          (_, i) =>
            i >= tables.tables5 * 5 &&
            i < tables.tables5 * 5 + tables.tables4 * 4
        )
        .map(({ id, name }, i) =>
          insertParticipant(
            Matches,
            Math.floor(i / 4) + 1 + tables.tables5,
            id,
            name
          )
        )
    );
  }

  const verificari = await Matches.aggregate([
    {
      $lookup: {
        from: `verificari_live_${eventID}`,
        localField: "id",
        foreignField: "id",
        as: "verificari",
      },
    },
    {
      $unwind: "$verificari", // In case there are multiple verifications per user
    },
    {
      $project: {
        id: 1,
        table: 1,
        name: 1,
        meci1: "$verificari.meci1",
        meci2: "$verificari.meci2",
        rude: "$verificari.rude",
        masa_redusa: "$verificari.masa_redusa",
      },
    },
    {
      $sort: { table: 1 },
    },
  ]);

  for (let i = 0; i < 15; i++) {
    await verifyMatches(verificari, Matches);
    await verifyMatchesReverse(verificari, Matches);
    verificari.sort((a, b) => a.table - b.table);
  }
};

// Check if two players have the same table and rude
const sameVerifications = (player1, player2) => {
  if (player1.rude && player2.rude) {
    return player1.table === player2.table && player1.rude === player2.rude;
  }
};

// Check if two players have different table and rude
const isSwitchable = (verificari, player1, player2) => {
  if (player1.table !== player2.table) {
    return verificari
      .filter((player) => player.table === player1.table)
      .every(
        (player) =>
          !player.rude || !player2.rude || player.rude !== player2.rude
      );
  }
};

// Switch tables between two players
const switchTables = async (Matches, player1, player2) => {
  await Matches.updateOne({ id: player1.id }, { table: player2.table });
  await Matches.updateOne({ id: player2.id }, { table: player1.table });

  const temp = player1.table;
  player1.table = player2.table;
  player2.table = temp;
};

// Switch tables if two players have the same table and rude
const verifyMatches = async (verificari, Matches) => {
  for (let i = 0; i < verificari.length; i++) {
    for (let j = i + 1; j < verificari.length; j++) {
      if (sameVerifications(verificari[i], verificari[j])) {
        for (let k = j + 1; k < verificari.length; k++) {
          if (isSwitchable(verificari, verificari[j], verificari[k])) {
            await switchTables(Matches, verificari[j], verificari[k]);
            return;
          }
        }
      }
    }
  }
};

const verifyMatchesReverse = async (verificari, Matches) => {
  for (let i = verificari.length - 1; i >= 0; i--) {
    for (let j = i - 1; j >= 0; j--) {
      if (sameVerifications(verificari[i], verificari[j])) {
        for (let k = j - 1; k >= 0; k--) {
          if (isSwitchable(verificari, verificari[k], verificari[j])) {
            await switchTables(Matches, verificari[j], verificari[k]);
            return;
          }
        }
      }
    }
  }
};

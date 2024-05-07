const playersPerTableCatan = (participantsNumber) => {
  let tables4;
  switch (participantsNumber % 4) {
    case 0:
      tables4 = participantsNumber / 4;
      break;
    case 1:
      tables4 = (participantsNumber - 9) / 4;
      break;
    case 2:
      tables4 = (participantsNumber - 6) / 4;
      break;
    case 3:
      tables4 = (participantsNumber - 3) / 4;
      break;
  }

  return tables4;
};

const playersPerTableWhist = (participantsNumber, playersPerTable) => {
  let tables4 = 0;
  let tables5 = 0;
  let tables6 = 0;

  if (participantsNumber < 12) {
    switch (participantsNumber) {
      case 4:
        tables4 = 1;
        break;
      case 5:
        tables5 = 1;
        break;
      case 6:
        tables6 = 1;
        break;
      case 8:
        tables4 = 2;
        break;
      case 9:
        tables5 = 1;
        tables4 = 1;
        break;
      case 10:
        tables5 = 2;
        break;
      case 11:
        tables6 = 1;
        tables5 = 1;
        break;
    }

    return { tables4, tables5, tables6 };
  }

  if (playersPerTable === "6") {
    if (participantsNumber < 20) {
      switch (participantsNumber) {
        case 12:
          tables6 = 2;
          break;
        case 13:
          tables5 = 1;
          tables4 = 2;
          break;
        case 14:
          tables5 = 2;
          tables4 = 1;
          break;
        case 15:
          tables5 = 3;
          break;
        case 16:
          tables6 = 1;
          tables5 = 2;
          break;
        case 17:
          tables6 = 2;
          tables5 = 1;
          break;
        case 18:
          tables6 = 3;
          break;
        case 19:
          tables5 = 3;
          tables4 = 1;
          break;
      }

      return { tables4, tables5, tables6 };
    }

    const remainder = participantsNumber % 6;
    switch (remainder) {
      case 0:
        tables6 = participantsNumber / 6;
        break;
      case 1:
        tables6 = (participantsNumber - 25) / 6;
        tables5 = 5;
        break;
      case 2:
        tables6 = (participantsNumber - 20) / 6;
        tables5 = 4;
        break;
      case 3:
        tables6 = (participantsNumber - 15) / 6;
        tables5 = 3;
        break;
      case 4:
        tables6 = (participantsNumber - 10) / 6;
        tables5 = 2;
        break;
      case 5:
        tables6 = (participantsNumber - 5) / 6;
        tables5 = 1;
        break;
    }

    return { tables4, tables5, tables6 };
  }

  if (participantsNumber < 20) {
    switch (participantsNumber) {
      case 12:
        tables4 = 3;
        break;
      case 13:
        tables5 = 1;
        tables4 = 2;
        break;
      case 14:
        tables5 = 2;
        tables4 = 1;
        break;
      case 15:
        tables5 = 3;
        break;
      case 16:
        tables4 = 4;
        break;
      case 17:
        tables5 = 1;
        tables4 = 3;
        break;
      case 18:
        tables5 = 2;
        tables4 = 2;
        break;
      case 19:
        tables5 = 3;
        tables4 = 1;
        break;
    }

    return { tables4, tables5, tables6 };
  }

  if (playersPerTable === "5") {
    const remainder = participantsNumber % 5;
    switch (remainder) {
      case 0:
        tables5 = participantsNumber / 5;
        break;
      case 1:
        tables5 = (participantsNumber - 16) / 5;
        tables4 = 4;
        break;
      case 2:
        tables5 = (participantsNumber - 12) / 5;
        tables4 = 3;
        break;
      case 3:
        tables5 = (participantsNumber - 8) / 5;
        tables4 = 2;
        break;
      case 4:
        tables5 = (participantsNumber - 4) / 5;
        tables4 = 1;
        break;
    }

    return { tables4, tables5, tables6 };
  }

  const remainder = participantsNumber % 4;
  switch (remainder) {
    case 0:
      tables4 = participantsNumber / 4;
      break;
    case 1:
      tables4 = (participantsNumber - 5) / 4;
      tables5 = 1;
      break;
    case 2:
      tables4 = (participantsNumber - 10) / 4;
      tables5 = 2;
      break;
    case 3:
      tables4 = (participantsNumber - 15) / 4;
      tables5 = 3;
      break;
  }

  return { tables4, tables5, tables6 };
};

export { playersPerTableCatan, playersPerTableWhist };

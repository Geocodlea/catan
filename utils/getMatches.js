import dbConnect from "/utils/dbConnect";
import * as Matches from "/models/Matches";

export const getMatches = async (type, round) => {
  const MatchesType = Matches[`Meciuri_live_${type}_${round}`];
  console.log(MatchesType);
  await dbConnect();
  const matches = await MatchesType.aggregate([
    {
      $group: {
        _id: "$table",
        participants: {
          $push: {
            id: "$id",
            table: "$table",
            name: "$name",
            score: "$score",
            host: "$host",
            img: "$img",
          },
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ]);

  return matches;
};

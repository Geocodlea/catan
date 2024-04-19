import EditableDataGrid from "@/components/EditableDataGrid";

import dbConnect from "/utils/dbConnect";
import Leaderboard from "/models/Leaderboard";

import { Paper, Typography } from "@mui/material";
import styles from "./page.module.css";

export default async function LeaderboardTable() {
  await dbConnect();
  const leaderboard = await Leaderboard.find({}).sort({ puncte: -1 });

  const filteredLeaderboard = leaderboard.map((user, i) => ({
    place: i + 1,
    name: user.nume,
    points: user.puncte,
  }));

  const columnsData = [
    {
      field: "place",
      headerName: "Loc",
      width: 100,
      flex: 1,
    },
    {
      field: "name",
      headerName: "Nume",
      width: 150,
      flex: 1,
    },
    {
      field: "points",
      headerName: "Puncte",
      width: 150,
      flex: 1,
      type: "number",
    },
  ];

  return (
    <Paper
      elevation={24}
      className={styles.card}
      sx={{ width: "100%", textAlign: "center" }}
    >
      <Typography variant="h2">Leaderboard</Typography>
      <EditableDataGrid
        columnsData={columnsData}
        data={filteredLeaderboard}
        apiURL={"leaderboard"}
        uniqueField={"id"}
        alertText={"user"}
        showAddRecord={false}
        showActions={false}
        hideFooter={true}
        disableColumnMenu={true}
      />
    </Paper>
  );
}

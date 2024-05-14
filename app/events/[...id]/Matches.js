import { useState, useEffect } from "react";
import EditableDataGrid from "@/components/EditableDataGrid";
import { Box, Typography, Stack } from "@mui/material";

const groupByTable = (participants) => {
  const groups = [];

  participants.forEach((participant) => {
    const { table } = participant;
    if (!groups[table]) {
      // Check if a group for this table exists
      groups[table] = []; // If not, initialize it
    }
    groups[table].push(participant);
  });

  return groups;
};

export default function Matches({ type, round, playerName }) {
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const getMatches = async () => {
      const data = await fetch(`/api/events/matches/${type}/${round}`);
      setParticipants(await data.json());
    };

    getMatches();
  }, [round]);

  const columnsData = [
    {
      field: "id",
      headerName: "id",
    },
    {
      field: "table",
      headerName: "Masa",
      width: 60,
    },
    {
      field: "nr",
      headerName: "Nr.",
      width: 50,
    },
    {
      field: "name",
      headerName: "Nume",
      minWidth: 150,
      flex: 1,
    },

    {
      field: "score",
      headerName: "Scor",
      editable: true,
      width: 80,
    },
  ];

  return (
    <Box sx={{ margin: "auto", maxWidth: "800px" }}>
      <Typography variant="h3" gutterBottom>
        Meciuri - Runda {round}
      </Typography>
      <Stack spacing={8}>
        {groupByTable(participants).map((group, index) => (
          <EditableDataGrid
            key={index}
            columnsData={columnsData}
            rowsData={group}
            pageSize={10}
            apiURL={"/events/matches"}
            eventType={type}
            round={round}
            playerName={playerName}
            alertText={"participant"}
            disableColumnMenu={true}
            hideSearch={true}
            hideFooter={true}
            hiddenColumn={"nr"}
          />
        ))}
      </Stack>
    </Box>
  );
}

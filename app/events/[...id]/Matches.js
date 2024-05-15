import Link from "next/link";
import { useState, useEffect } from "react";
import EditableDataGrid from "@/components/EditableDataGrid";
import CountdownTimer from "@/components/CountdownTimer";
import { Box, Typography, Stack } from "@mui/material";

export default function Matches({ type, round, host, isAdmin }) {
  const [matches, setMatches] = useState([]);
  const [timer, setTimer] = useState("");

  useEffect(() => {
    const getMatches = async () => {
      const data = await fetch(`/api/events/matches/${type}/${round}`);
      const result = await data.json();
      setMatches(result.matches);
      setTimer(result.timer);
    };

    getMatches();

    const intervalId = setInterval(getMatches, 30000);

    return () => clearInterval(intervalId);
  }, [round]);

  const columnsData = [
    {
      field: "id",
      headerName: "id",
    },
    {
      field: "table",
      headerName: "Masa",
      editable: isAdmin,
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
      editable: isAdmin,
      minWidth: 150,
      flex: 1,
    },

    {
      field: "score",
      headerName: "Scor",
      editable: isAdmin,
      width: 80,
    },
  ];

  return (
    <Box sx={{ margin: "auto", maxWidth: "800px" }}>
      <Typography variant="h3" gutterBottom>
        Meciuri - Runda {round}
      </Typography>
      {timer && <CountdownTimer targetDate={new Date(timer)} />}
      <Stack spacing={6}>
        {matches.map((match, index) => (
          <div key={index}>
            <EditableDataGrid
              columnsData={columnsData}
              rowsData={match.participants}
              pageSize={10}
              apiURL={`/events/matches/${type}/${round}/${host}/${isAdmin}`}
              alertText={"player"}
              disableColumnMenu={true}
              hideSearch={true}
              hideFooter={true}
              hiddenColumn={"nr"}
            />
            {match.participants[0].host && (
              <Box
                p={2}
                textAlign={"center"}
                border={"1px solid rgb(224, 224, 224)"}
                borderRadius={"4px"}
              >
                Rezultat trimis de: {match.participants[0].host}
              </Box>
            )}
            {match.participants[0].img && (
              <Box
                p={2}
                textAlign={"center"}
                border={"1px solid rgb(224, 224, 224)"}
                borderRadius={"4px"}
              >
                <Link href={match.participants[0].img} target="_blank">
                  Imagine Rezultat
                </Link>
              </Box>
            )}
          </div>
        ))}
      </Stack>
    </Box>
  );
}

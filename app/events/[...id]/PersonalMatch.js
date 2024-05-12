import { useState, useEffect } from "react";
import EditableDataGrid from "@/components/EditableDataGrid";
import { Box, Typography } from "@mui/material";

export default function PersonalMatch({ type, round, userID }) {
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const getPersonalMatch = async () => {
      const data = await fetch(
        `/api/events/personalMatch/${type}/${round}/${userID}`
      );
      setParticipants(await data.json());
    };

    getPersonalMatch();
  }, [round]);

  console.log(participants);

  const columnsData = [
    {
      field: "id",
      headerName: "id",
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
        Meci Propriu
      </Typography>
      {participants.length ? (
        <EditableDataGrid
          columnsData={columnsData}
          rowsData={participants}
          pageSize={10}
          showActions={true}
          apiURL={"/events/personalMatch"}
          eventType={type}
          alertText={"participant"}
          disableColumnMenu={true}
        />
      ) : (
        <p>
          Salutare, în prezent este deja activ un eveniment. Îi poți urmări
          desfășurarea la celelalte secțiuni ale acestui meniu :) Înscrierile
          pentru următorul eveniment vor fi disponibile în maxim 2 zile.
        </p>
      )}
    </Box>
  );
}

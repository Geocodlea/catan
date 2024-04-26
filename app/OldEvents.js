"use client";

import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";

import EditableDataGrid from "@/components/EditableDataGrid";
import AllEvents from "./AllEvents";

function findGame(item) {
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
}

const OldEventsTable = () => {
  const [oldEvents, setOldEvents] = useState([]);

  const allEvents = async () => {
    const response = await fetch("/api/oldevents", {
      method: "POST",
    });
    const data = await response.json();

    setOldEvents(data);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/oldevents");
      const data = await response.json();

      setOldEvents(data);
    };

    fetchData();
  }, []);

  const filteredOldEvents = oldEvents.map((event, i) => {
    const isOnline = event.name.includes("online");
    const isLive = event.name.includes("live");
    const mode = isOnline ? "online" : isLive ? "live" : "Campionat Național";

    const game = findGame(event.name);

    return {
      no: i + 1,
      name: `${game} - ${mode}`,
      link: `/oldevents/${event.name}`,
    };
  });

  const columnsData = [
    {
      field: "no",
      headerName: "Nr",
      width: 50,
    },
    {
      field: "name",
      headerName: "Nume Joc",
      minWidth: 250,
      flex: 1,
    },
    {
      field: "link",
      headerName: "Clasament",
      width: 150,
    },
  ];

  return (
    <Box sx={{ width: "100%", maxWidth: "800px" }}>
      <Typography variant="h3">Evenimente Anterioare</Typography>
      <EditableDataGrid
        columnsData={columnsData}
        rowsData={filteredOldEvents}
        disableColumnMenu={true}
        pageSize={10}
      />
      <AllEvents allEvents={allEvents} />
    </Box>
  );
};

export default OldEventsTable;

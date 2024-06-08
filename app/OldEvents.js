"use client";

import { useSession } from "next-auth/react";
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
  const { data: session } = useSession();
  const [oldEvents, setOldEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = session?.user.role === "admin";
  let cost = 0;
  let total = 0;

  const allEvents = async () => {
    setLoading(true);
    const response = await fetch("/api/oldevents", {
      method: "POST",
    });
    const data = await response.json();

    setOldEvents(data);
    setLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/oldevents");
      const data = await response.json();

      setOldEvents(data);
    };

    fetchData();
    setLoading(false);
  }, []);

  const filteredOldEvents = oldEvents.map((event) => {
    const isOnline = event.name.includes("online");
    const isLive = event.name.includes("live");
    const mode = isOnline ? "online" : isLive ? "live" : "Campionat Național";

    const game = findGame(event.name);

    const isCurrentMonth = event.name.includes("06.2024");
    if (isCurrentMonth) {
      cost = event.participants * 3;
      total += cost;
    }

    return {
      name: `${game} - ${mode}`,
      link: `/oldevents/${event.name}`,
      cost: isCurrentMonth ? cost : null,
      total: isCurrentMonth ? total : null,
    };
  });

  const columnsData = [
    {
      field: "nr",
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

  if (isAdmin) {
    columnsData.push(
      {
        field: "cost",
        headerName: "Calcul",
        width: 100,
      },
      {
        field: "total",
        headerName: "Total",
        width: 100,
      }
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: "800px" }}>
      <Typography variant="h3">Evenimente Anterioare</Typography>
      <EditableDataGrid
        columnsData={columnsData}
        rowsData={filteredOldEvents}
        disableColumnMenu={true}
        pageSize={10}
        loading={loading}
      />
      <AllEvents allEvents={allEvents} />
    </Box>
  );
};

export default OldEventsTable;

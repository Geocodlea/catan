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

  console.log(oldEvents);

  const filteredOldEvents = oldEvents.map((event, i) => {
    const isOnline = event.name.includes("online");
    const isLive = event.name.includes("live");
    const mode = isOnline ? "online" : isLive ? "live" : "Campionat Național";

    const game = findGame(event.name);

    return {
      no: i + 1,
      name: `${game} - ${mode}`,
      link: `/oldevents/${event.name}`,
      cost: event.participants * 3,
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

  if (session?.user.role === "admin") {
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

  useEffect(() => {
    if (session?.user.role === "admin") {
      const fetchData = async () => {
        const response = await fetch("/api/costEvents");
        const data = await response.json();

        const updatedFirstArray = oldEvents.map((obj, index) => {
          if (data[index]) {
            return { ...obj, participants: data[index].participants };
          } else {
            return obj; // If no corresponding object found in second array, return original object
          }
        });

        setOldEvents(updatedFirstArray);

        // setOldEvents(
        //   oldEvents.forEach((obj, i) => {
        //     // Check if there is a corresponding object in the second array
        //     if (data[i]) {
        //       // Add the 'participants' property from the second array to the object in the first array
        //       obj.participants = data[i].participants;
        //     }
        //   })
        // );
      };

      fetchData();
    }
  }, [session]);

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

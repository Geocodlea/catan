"use client";

import styles from "./page.module.css";

import { useState, useEffect } from "react";
import Link from "next/link";

import { DataGrid, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { Box, Paper, Typography } from "@mui/material";

function QuickSearchToolbar() {
  return (
    <Box
      sx={{
        p: 0.5,
        pb: 0,
        ml: "auto",
      }}
    >
      <GridToolbarQuickFilter />
    </Box>
  );
}

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
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(`/api/old`);
      const data = await result.json();

      setRows(
        data.map((event, i) => {
          const isOnline = event.name.includes("online");
          const isLive = event.name.includes("live");
          const mode = isOnline
            ? "online"
            : isLive
            ? "live"
            : "Campionat Național";

          const game = findGame(event.name);

          return {
            id: event._id,
            no: i + 1,
            name: `${game} - ${mode}`,
            link: `/oldevents/${event.name}`,
            event: `Clasament ${event.name.slice(-10)}`,
          };
        })
      );
    };

    fetchData();
  }, []);

  const columns = [
    {
      field: "no",
      headerName: "Nr",
      width: 80,
    },
    {
      field: "name",
      headerName: "Nume Joc",
      width: 250,
    },
    {
      field: "link",
      headerName: "Eveniment",
      width: 200,

      renderCell: (params) => (
        <Link
          href={params.value}
          style={{
            color: "blue",
          }}
        >
          {params.row.event}
        </Link>
      ),
    },
  ];

  return (
    <Paper
      elevation={24}
      className={styles.card}
      sx={{ width: "100%", textAlign: "center" }}
    >
      <Typography variant="h2">Evenimente Anterioare</Typography>
      <Box
        sx={{
          marginTop: "2rem",
          height: 500,
          width: "100%",
          "& .actions": {
            color: "text.secondary",
          },
          "& .textPrimary": {
            color: "text.primary",
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          disableColumnFilter
          disableColumnSelector
          disableColumnSorting
          disableDensitySelector
          disableColumnMenu
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10, 25, 50]}
          slots={{ toolbar: QuickSearchToolbar }}
        />
      </Box>
    </Paper>
  );
};

export default OldEventsTable;

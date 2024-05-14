"use client";

import { useState, useEffect } from "react";
import EditableDataGrid from "@/components/EditableDataGrid";
import { Typography } from "@mui/material";

export default function Participanti({ type }) {
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(`/api/events/participants/${type}`);
      setParticipants(await data.json());
    };

    fetchData();
  }, []);

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
      editable: true,
      minWidth: 150,
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      editable: true,
      width: 150,
    },
    {
      field: "obs",
      headerName: "Obs",
      editable: true,
      width: 200,
    },
    {
      field: "rude",
      headerName: "Rude",
      editable: true,
      width: 55,
    },
  ];

  return (
    <div>
      <Typography variant="h3" gutterBottom>
        Participanți
      </Typography>
      <EditableDataGrid
        columnsData={columnsData}
        rowsData={participants}
        pageSize={50}
        density={"compact"}
        showActions={true}
        showAddRecord={true}
        apiURL={`/events/participants/${type}`}
        alertText={"participant"}
        disableColumnMenu={true}
      />
    </div>
  );
}

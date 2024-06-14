"use client";

import { useState, useEffect } from "react";
import EditableDataGrid from "@/components/EditableDataGrid";
import { Typography } from "@mui/material";

export default function Participanti({ type, round, isAdmin }) {
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
      editable: isAdmin,
      minWidth: 150,
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      editable: isAdmin,
      width: 150,
    },
    {
      field: "obs",
      headerName: "Obs",
      editable: isAdmin,
      width: 200,
    },
    {
      field: "rude",
      headerName: "Rude",
      editable: isAdmin,
      width: 55,
    },
  ];

  return (
    <div>
      <h3>Participanți</h3>
      <EditableDataGrid
        columnsData={columnsData}
        rowsData={participants}
        pageSize={50}
        density={"compact"}
        showActions={isAdmin}
        showAddRecord={isAdmin}
        apiURL={`/events/participants/${type}/${round}`}
        alertText={"participant"}
        disableColumnMenu={true}
      />
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import EditableDataGrid from "@/components/EditableDataGrid";

export default function Participanti({
  type,
  round,
  isAdmin,
  isOrganizer,
  eventID,
}) {
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(`/api/events/participants/${type}/${eventID}`);
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
      editable: isAdmin || isOrganizer,
      minWidth: 150,
      flex: 1,
    },
    {
      field: "tel",
      headerName: "Telefon",
      editable: isAdmin || isOrganizer,
      minWidth: 150,
    },
    {
      field: "email",
      headerName: "Email",
      editable: isAdmin || isOrganizer,
      width: 150,
    },
    {
      field: "obs",
      headerName: "Obs",
      editable: isAdmin || isOrganizer,
      width: 150,
    },
    {
      field: "rude",
      headerName: "Rude",
      editable: isAdmin || isOrganizer,
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
        showActions={isAdmin || isOrganizer}
        showAddRecord={isAdmin || isOrganizer}
        apiURL={`/events/participants/${type}/${round}/${eventID}`}
        alertText={"participant"}
        disableColumnMenu={true}
      />
    </div>
  );
}

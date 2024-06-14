import { useState, useEffect } from "react";
import EditableDataGrid from "@/components/EditableDataGrid";
import { Typography } from "@mui/material";

const columnGroupingModel = [
  {
    groupId: "Masa",
    headerAlign: "center",
    children: [{ field: "masar1" }, { field: "masar2" }, { field: "masar3" }],
  },
  {
    groupId: "Puncte",
    headerAlign: "center",
    children: [
      { field: "puncter1" },
      { field: "puncter2" },
      { field: "puncter3" },
      { field: "punctetotal" },
    ],
  },
  {
    groupId: "Scor R1",
    headerAlign: "center",
    children: [{ field: "scorjocr1" }, { field: "scortotalr1" }],
  },
  {
    groupId: "Scor R2",
    headerAlign: "center",
    children: [{ field: "scorjocr2" }, { field: "scortotalr2" }],
  },
  {
    groupId: "Scor R3",
    headerAlign: "center",
    children: [{ field: "scorjocr3" }, { field: "scortotalr3" }],
  },
  {
    groupId: "Scor",
    headerAlign: "center",
    children: [{ field: "scorjocuri" }, { field: "scortotal" }],
  },
];

export default function Ranking({ type, round }) {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const getRanking = async () => {
      const data = await fetch(`/api/events/ranking/${type}/${round}/`);
      setPlayers(await data.json());
    };

    getRanking();

    const intervalId = setInterval(getRanking, 30000);

    return () => clearInterval(intervalId);
  }, []);

  const columnsData = [
    {
      field: "nr",
      headerName: "Loc",
      width: 50,
    },
    {
      field: "name",
      headerName: "Nume",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "masar1",
      headerName: "R1",
      width: 50,
    },
    {
      field: "masar2",
      headerName: "R2",
      width: 50,
    },
    {
      field: "masar3",
      headerName: "R3",
      width: 50,
    },
    {
      field: "puncter1",
      headerName: "R1",
      width: 50,
    },
    {
      field: "puncter2",
      headerName: "R2",
      width: 50,
    },
    {
      field: "puncter3",
      headerName: "R3",
      width: 50,
    },
    {
      field: "punctetotal",
      headerName: "Total",
      width: 60,
      headerClassName: "table-highlight",
      cellClassName: "table-highlight",
    },
    {
      field: "scorjocr1",
      headerName: "Joc",
      width: 60,
    },
    {
      field: "scortotalr1",
      headerName: "Total",
      width: 60,
    },
    {
      field: "scorjocr2",
      headerName: "Joc",
      width: 60,
    },
    {
      field: "scortotalr2",
      headerName: "Total",
      width: 60,
    },
    {
      field: "scorjocr3",
      headerName: "Joc",
      width: 60,
    },
    {
      field: "scortotalr3",
      headerName: "Total",
      width: 60,
    },
    {
      field: "scorjocuri",
      headerName: "Jocuri",
      width: 60,
      headerClassName: "table-highlight",
      cellClassName: "table-highlight",
    },
    {
      field: "scortotal",
      headerName: "Total",
      width: 60,
      headerClassName: "table-highlight",
      cellClassName: "table-highlight",
    },
    {
      field: "procent",
      headerName: "Procent",
      headerClassName: "table-highlight",
      cellClassName: "table-highlight",
    },
  ];

  return (
    <>
      <Typography variant="h3">Clasament</Typography>
      <EditableDataGrid
        columnsData={columnsData}
        rowsData={players}
        disableColumnMenu={true}
        columnGroupingModel={columnGroupingModel}
        pageSize={50}
        density={"compact"}
      />
    </>
  );
}

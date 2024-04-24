import EditableDataGrid from "@/components/EditableDataGrid";

import dbConnect from "/utils/dbConnect";
import OldEvents from "/models/OldEvents";

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

const OldEventTable = async ({ params }) => {
  await dbConnect();

  const oldevent = await OldEvents.aggregate([
    {
      $match: {
        name: params.name[0],
      },
    },
    {
      $unwind: "$data",
    },
    {
      $addFields: {
        "data.punctetotalNumber": { $toDouble: "$data.punctetotal" },
        "data.punctejocuriNumber": { $toDouble: "$data.punctejocuri" },
        "data.procentNumber": { $toDouble: "$data.procent" },
      },
    },
    {
      $sort: {
        "data.punctetotalNumber": -1,
        "data.punctejocuriNumber": -1,
        "data.procentNumber": -1,
      },
    },
    {
      $group: {
        _id: "$_id",
        type: { $first: "$type" },
        name: { $first: "$name" },
        database: { $first: "$database" },
        data: { $push: "$data" },
      },
    },
  ]);

  const filteredOldEvent = oldevent[0].data.map((user, i) => ({
    loc: i + 1,
    userid: user.userid,
    nume: user.nume,
    masar1: user.masar1,
    masar2: user.masar2,
    masar3: user.masar3,
    puncter1: user.puncter1,
    puncter2: user.puncter2,
    puncter3: user.puncter3,
    punctetotal: user.punctetotal,
    scorjocr1: user.punctejocr1,
    scortotalr1: user.punctejoctotalr1,
    scorjocr2: user.punctejocr2,
    scortotalr2: user.punctejoctotalr2,
    scorjocr3: user.punctejocr3,
    scortotalr3: user.punctejoctotalr3,
    scorjocuri: user.punctejoctotal,
    scortotal: user.punctejocuri,
    procent: user.procent,
  }));

  const columnsData = [
    {
      field: "loc",
      headerName: "Loc",
      width: 50,
    },
    {
      field: "nume",
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
        rowsData={filteredOldEvent}
        showAddRecord={false}
        showActions={false}
        disableColumnMenu={true}
        columnGroupingModel={columnGroupingModel}
        pageSize={50}
        density={"compact"}
      />
    </>
  );
};

export default OldEventTable;

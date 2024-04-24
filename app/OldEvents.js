import { Box, Typography } from "@mui/material";
import EditableDataGrid from "@/components/EditableDataGrid";

import dbConnect from "/utils/dbConnect";
import OldEvents from "/models/OldEvents";

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

const OldEventsTable = async () => {
  await dbConnect();
  const oldEvents = await OldEvents.aggregate([
    {
      $match: {
        name: { $regex: /^clasament_/ }, // Filter documents that start with 'clasament_'
      },
    },
    {
      $addFields: {
        nameSplit: { $split: ["$name", "_"] }, // Split the 'name' field by '_'
      },
    },
    {
      $addFields: {
        dateStr: { $arrayElemAt: ["$nameSplit", -1] }, // Extract the date string
      },
    },
    {
      $addFields: {
        date: {
          $dateFromString: {
            dateString: "$dateStr",
            format: "%d.%m.%Y",
          },
        },
      },
    },
    {
      $sort: { date: -1 }, // Sort by the extracted date
    },
  ]);

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
        showAddRecord={false}
        showActions={false}
        disableColumnMenu={true}
        pageSize={10}
      />
    </Box>
  );
};

export default OldEventsTable;

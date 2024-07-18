import { redirect } from "next/navigation";

import { authOptions } from "/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

import { Paper, Box, Stack, Typography } from "@mui/material";

import ProfileForm from "./ProfileForm";
import DeleteAccount from "./DeleteAccount";
import ProfileImage from "./ProfileImage";
import EditableDataGrid from "@/components/EditableDataGrid";

import dbConnect from "/utils/dbConnect";
import OldEvents from "@/models/OldEvents";
import { gameName } from "@/utils/helpers";

export default async function Profile() {
  const session = await getServerSession(authOptions);

  if (!session) redirect(`/`);

  await dbConnect();
  const participations = await OldEvents.find({
    data: {
      $elemMatch: {
        nume: session.user.name,
      },
    },
  }).select("name");

  const filteredParticipations = participations.map((event) => ({
    name: gameName(event.name),
    link: `/oldevents/${event.name}`,
  }));

  const columnsData = [
    {
      field: "nr",
      headerName: "Nr.",
      width: 50,
    },
    {
      field: "name",
      headerName: "Eveniment",
      minWidth: 250,
      flex: 1,
    },
    {
      field: "link",
      headerName: "Data",
      width: 150,
    },
  ];

  return (
    <Paper
      elevation={24}
      sx={{
        width: "100%",
        maxWidth: "750px",
        marginBottom: "3rem",
        padding: ["1rem 2rem", "2rem 4rem"],
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "-10rem",
          marginBottom: "3rem",
        }}
      >
        <ProfileImage />
      </Box>

      <Stack spacing={6}>
        <div>
          <Typography variant="h2">Profile</Typography>
          <ProfileForm />
        </div>

        <div>
          <Typography variant="h2">Istoric Participări</Typography>
          <EditableDataGrid
            columnsData={columnsData}
            rowsData={filteredParticipations}
            pageSize={10}
            density={"compact"}
          />
        </div>

        <div>
          <Box mb={2} mt={4}>
            <Typography variant="body1" gutterBottom>
              Toate datele contului vor fi șterse permanent și nu vei mai avea
              posibilitatea să reactivezi acest cont.
            </Typography>
          </Box>
          <DeleteAccount />
        </div>
      </Stack>
    </Paper>
  );
}

import { authOptions } from "/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

import { Paper, Typography } from "@mui/material";

import CreateEventForm from "/app/admin/CreateEventForm";

export default async function Organizer() {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "organizer") redirect(`/`);

  return (
    <Paper elevation={24} className="form-paper">
      <Typography variant="h2">Create Event</Typography>
      <CreateEventForm userID={session.user.id} />
    </Paper>
  );
}

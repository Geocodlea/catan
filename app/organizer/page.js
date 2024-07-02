import { authOptions } from "/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

import styles from "/app/page.module.css";
import { Paper, Typography } from "@mui/material";

import CreateEventForm from "./CreateEventForm";

export default async function Admin() {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "organizer") redirect(`/`);

  return (
    <Paper elevation={24} className={styles.card} sx={{ maxWidth: "600px" }}>
      <Typography variant="h2">Create Event</Typography>
      <CreateEventForm userID={session.user.id} />
    </Paper>
  );
}

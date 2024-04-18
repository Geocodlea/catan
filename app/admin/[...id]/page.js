import { authOptions } from "/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

import styles from "/app/page.module.css";
import { Paper, Typography } from "@mui/material";

import UpdateEvent from "./UpdateEvent";

export default async function Update({ params }) {
  const session = await getServerSession(authOptions);

  if (session?.user.role !== "admin") redirect(`/`);

  return (
    <Paper
      elevation={24}
      className={styles.card}
      sx={{ maxWidth: "600px", textAlign: "center" }}
    >
      <Typography variant="h2">Update Event</Typography>
      <UpdateEvent params={params} />
    </Paper>
  );
}

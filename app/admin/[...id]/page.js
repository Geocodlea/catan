import { authOptions } from "/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

import { Paper, Typography } from "@mui/material";

import UpdateEvent from "./UpdateEvent";

export default async function Update({ params }) {
  const session = await getServerSession(authOptions);

  if (session?.user.role !== "organizer" && session?.user.role !== "admin")
    redirect(`/`);

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
      <Typography variant="h2">Update Event</Typography>
      <UpdateEvent params={params} />
    </Paper>
  );
}

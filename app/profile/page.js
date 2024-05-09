import { redirect } from "next/navigation";

import { authOptions } from "/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import styles from "/app/page.module.css";

import { Paper, Typography, Box } from "@mui/material";

import ProfileForm from "./ProfileForm";
import DeleteAccount from "./DeleteAccount";
import ProfileImage from "./ProfileImage";

export default async function Profile() {
  const session = await getServerSession(authOptions);

  if (!session) redirect(`/`);

  return (
    <Paper
      elevation={24}
      className={styles.card}
      sx={{ maxWidth: "600px", marginBottom: "3rem" }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "-10rem",
        }}
      >
        <ProfileImage />
      </Box>
      <Typography variant="h2">Profile</Typography>

      <ProfileForm />
      <DeleteAccount />
    </Paper>
  );
}

"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";

import { Box } from "@mui/material";

export default function ProfileImage() {
  const { data: session } = useSession();

  return (
    <Box
      sx={{
        position: "relative",
        height: "250px",
        width: "250px",
      }}
    >
      <Image
        alt="profile image"
        src={session?.user.image ? session.user.image : "/img/avatar.png"}
        fill
        sizes="100vw"
        style={{
          objectFit: "cover",
          borderRadius: "50%",
        }}
      />
    </Box>
  );
}

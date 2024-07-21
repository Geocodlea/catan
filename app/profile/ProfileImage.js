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
        src={session?.user.image ? session.user.image : "/avatars/avatar.png"}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority
        style={{
          objectFit: "cover",
          borderRadius: "50%",
        }}
      />
    </Box>
  );
}

"use client";

import { Box } from "@mui/material";

import { useSelectedLayoutSegments } from "next/navigation";
import Image from "next/image";
import catanBg from "/public/img/catan_bg.jpg";
import eventBg from "/public/img/event_bg.jpg";
import profileBg from "/public/img/profile_bg.jpg";

function Banner({ children }) {
  const segments = useSelectedLayoutSegments();
  let imageUrl = catanBg;

  if (segments[0] === "events") {
    imageUrl = eventBg;
  }

  if (segments[0] === "profile") {
    imageUrl = profileBg;
  }

  return (
    <>
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "50vh",
          zIndex: -1,
        }}
      >
        <Image
          alt="background"
          src={imageUrl}
          placeholder="blur"
          fill
          sizes="100vw"
          style={{
            zIndex: -2,
            objectFit: "cover",
          }}
        />
      </Box>
      {children}
    </>
  );
}

export default Banner;

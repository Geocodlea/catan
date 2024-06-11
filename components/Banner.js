"use client";

import { Box } from "@mui/material";

import { useState, useEffect } from "react";
import { useSelectedLayoutSegment } from "next/navigation";
import Image from "next/image";
import bg from "/public/img/bg.jpg";
import aboutBg from "/public/img/about_bg.jpg";
import contactBg from "/public/img/contact_bg.jpg";
import profileBg from "/public/img/profile_bg.jpg";
// import otherBg from "/public/img/other_bg.jpg";

function Banner({ children }) {
  const segment = useSelectedLayoutSegment();

  let imageUrl;
  switch (segment) {
    case "about":
      imageUrl = aboutBg;
      break;
    case "contact":
      imageUrl = contactBg;
      break;
    case "profile":
      imageUrl = profileBg;
      break;
    default:
      imageUrl = bg;
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

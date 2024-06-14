"use client";

import { Box } from "@mui/material";

import { useSelectedLayoutSegments } from "next/navigation";
import Image from "next/image";
import bg from "/public/img/bg.jpg";
import catanBg from "/public/img/catan_bg.webp";
import cavaleriBg from "/public/img/cavaleri_bg.webp";
import rentzBg from "/public/img/rentz_bg.webp";
import aboutBg from "/public/img/about_bg.jpg";
import contactBg from "/public/img/contact_bg.jpg";
import profileBg from "/public/img/profile_bg.jpg";

function Banner({ children }) {
  const segments = useSelectedLayoutSegments();
  let imageUrl;

  const [segment, secondSegment] = segments;

  if (segments.length === 0) {
    imageUrl = catanBg;
  } else if (segments.length === 1) {
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
  } else if (segments[0] === "events") {
    const eventType = secondSegment.split("/")[0];
    switch (eventType) {
      case "catan":
        imageUrl = catanBg;
        break;
      case "cavaleri":
        imageUrl = cavaleriBg;
        break;
      case "whist":
      case "rentz":
        imageUrl = rentzBg;
        break;
      default:
        imageUrl = catanBg;
    }
  } else {
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
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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

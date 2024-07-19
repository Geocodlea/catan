"use client";

import { Typography } from "@mui/material";

export default function ErrorPage() {
  return (
    <>
      <Typography variant="h1" color={"error"}>
        ERROR
      </Typography>
      <Typography variant="h4">Something went wrong</Typography>
    </>
  );
}

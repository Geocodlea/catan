"use client";

import { useSearchParams } from "next/navigation";

import { Typography } from "@mui/material";

export default function ErrorAuth() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <>
      <Typography variant="h1" color={"error"} gutterBottom>
        ERROR
      </Typography>
      <Typography variant="h4" gutterBottom>
        {error}
      </Typography>
    </>
  );
}

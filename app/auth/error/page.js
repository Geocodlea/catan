"use client";

import { useSearchParams } from "next/navigation";

import styles from "/app/page.module.css";

import { Typography } from "@mui/material";

export default function ErrorAuth() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <>
      <Typography variant="h1" className={styles.title} color={"error"}>
        ERROR
      </Typography>
      <Typography align="center" sx={{ fontSize: "2rem" }}>
        {error}
      </Typography>
    </>
  );
}

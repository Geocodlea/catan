"use client";

import styles from "./page.module.css";

import { Typography } from "@mui/material";

export default function ErrorPage() {
  return (
    <>
      <Typography variant="h1" className={styles.title} color={"error"}>
        ERROR
      </Typography>
      <Typography sx={{ fontSize: "2rem" }}>Something went wrong</Typography>
    </>
  );
}

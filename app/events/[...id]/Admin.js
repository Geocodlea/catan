"use client";

import { useState } from "react";
import styles from "@/app/page.module.css";
import { Box } from "@mui/material";

import AlertMsg from "@/components/AlertMsg";
import { startButtons, resetButton } from "@/utils/adminButtons";

export default function Admin({ type, round }) {
  const [alert, setAlert] = useState({ text: "", severity: "" });
  const [loading, setLoading] = useState(false);

  const isFinalRound =
    type === "catan"
      ? round === 3
      : type === "cavaleri" || type === "whist"
      ? round === 2
      : type === "rentz"
      ? round === 1
      : false;

  const start = async (players) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/events/start/${type}/${players}/${round + 1}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success === false) {
        throw new Error(data.message);
      }

      setLoading(false);
      setAlert({
        text: `Generare meciuri cu succes`,
        severity: "success",
      });
    } catch (error) {
      setAlert({ text: `${error}`, severity: "error" });
    }
  };

  const reset = async () => {
    try {
      const response = await fetch(`/api/events/reset/${type}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success === false) {
        throw new Error(data.message);
      }

      setAlert({
        text: `Resetare cu succes`,
        severity: "success",
      });
    } catch (error) {
      setAlert({ text: `${error}`, severity: "error" });
    }
  };

  const timer = async () => {
    console.log("timer");
  };

  return (
    <Box className={styles.grid} textAlign={"center"}>
      {startButtons(type, loading, round, isFinalRound, start, timer)}
      {resetButton(isFinalRound, reset)}
      <AlertMsg alert={alert} />
    </Box>
  );
}

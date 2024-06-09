"use client";

import { useState } from "react";
import styles from "@/app/page.module.css";
import { Box } from "@mui/material";

import AlertMsg from "@/components/AlertMsg";
import { StartButtons, ResetButton } from "@/utils/adminButtons";

export default function Admin({ type, round, isFinalRound }) {
  const [alert, setAlert] = useState({ text: "", severity: "" });
  const [loading, setLoading] = useState(false);

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
      const response = await fetch(
        `/api/events/reset/${type}/${round}/${isFinalRound}`,
        {
          method: "DELETE",
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

      setAlert({
        text: `Resetare cu succes`,
        severity: "success",
      });
    } catch (error) {
      setAlert({ text: `${error}`, severity: "error" });
    }
  };

  const timer = async (timerMinutes) => {
    try {
      const response = await fetch(`/api/events/timer/${type}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ timerMinutes }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success === false) {
        throw new Error(data.message);
      }

      setAlert({
        text: `Pornit timer cu succes`,
        severity: "success",
      });
    } catch (error) {
      setAlert({ text: `${error}`, severity: "error" });
    }
  };

  return (
    <Box className={styles.grid} textAlign={"center"}>
      <StartButtons
        type={type}
        loading={loading}
        round={round}
        isFinalRound={isFinalRound}
        start={start}
        timer={timer}
      />
      <ResetButton round={round} isFinalRound={isFinalRound} reset={reset} />
      <AlertMsg alert={alert} />
    </Box>
  );
}

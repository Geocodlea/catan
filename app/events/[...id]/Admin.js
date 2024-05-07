"use client";

import { useState } from "react";
import styles from "@/app/page.module.css";
import { Box, Button, Stack, Typography } from "@mui/material";

import AlertMsg from "@/components/AlertMsg";

export default function Admin({ type }) {
  const [alert, setAlert] = useState({ text: "", severity: "" });

  const start = async (players) => {
    try {
      const response = await fetch(`/api/events/start/${type}/${players}`, {
        method: "POST",
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

  let startButton;
  if (type === "catan" || type === "cavaleri") {
    startButton = (
      <Box>
        <Typography gutterBottom>Generare meciuri 4 juc.</Typography>
        <Button
          variant="contained"
          className="btn btn-primary"
          onClick={() => start(4)}
        >
          Start
        </Button>
      </Box>
    );
  } else {
    startButton = (
      <Stack spacing={2}>
        <Box>
          <Typography gutterBottom>Generare meciuri 6 juc.</Typography>
          <Button
            variant="contained"
            className="btn btn-primary"
            onClick={() => start(6)}
          >
            Start
          </Button>
        </Box>
        <Box>
          <Typography gutterBottom>Generare meciuri 5 juc.</Typography>
          <Button
            variant="contained"
            className="btn btn-primary"
            onClick={() => start(5)}
          >
            Start
          </Button>
        </Box>
        <Box>
          <Typography gutterBottom>Generare meciuri 4 juc.</Typography>
          <Button
            variant="contained"
            className="btn btn-primary"
            onClick={() => start(4)}
          >
            Start
          </Button>
        </Box>
      </Stack>
    );
  }

  return (
    <Box className={styles.grid}>
      {startButton}

      <Box>
        <Typography gutterBottom>
          Șterge jucătorii înscriși și permite înscrieri
        </Typography>
        <Button variant="contained" className="btn btn-error" onClick={reset}>
          Reset
        </Button>
      </Box>
      <AlertMsg alert={alert} />
    </Box>
  );
}

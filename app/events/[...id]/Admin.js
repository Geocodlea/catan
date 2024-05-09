"use client";

//import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "@/app/page.module.css";
import { Box, Button, Stack, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import AlertMsg from "@/components/AlertMsg";

export default function Admin({ type, id, round }) {
  const [alert, setAlert] = useState({ text: "", severity: "" });
  const [loading, setLoading] = useState(false);
  //  const router = useRouter();

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

      // router.push(`/events/${type}/${id}`);
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
        <LoadingButton
          loading={loading}
          loadingIndicator="Generating..."
          variant="contained"
          className="btn btn-primary"
          onClick={() => start(4)}
        >
          Start
        </LoadingButton>
      </Box>
    );
  } else {
    startButton = (
      <Stack spacing={2}>
        <Box>
          <Typography gutterBottom>Generare meciuri 6 juc.</Typography>
          <LoadingButton
            loading={loading}
            loadingIndicator="Generating..."
            variant="contained"
            className="btn btn-primary"
            onClick={() => start(6)}
          >
            Start
          </LoadingButton>
        </Box>
        <Box>
          <Typography gutterBottom>Generare meciuri 5 juc.</Typography>
          <LoadingButton
            loading={loading}
            loadingIndicator="Generating..."
            variant="contained"
            className="btn btn-primary"
            onClick={() => start(5)}
          >
            Start
          </LoadingButton>
        </Box>
        <Box>
          <Typography gutterBottom>Generare meciuri 4 juc.</Typography>
          <LoadingButton
            loading={loading}
            loadingIndicator="Generating..."
            variant="contained"
            className="btn btn-primary"
            onClick={() => start(4)}
          >
            Start
          </LoadingButton>
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

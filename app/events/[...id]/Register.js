"use client";

import { useState } from "react";
import styles from "@/app/page.module.css";
import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";

import { AddToCalendarButton } from "add-to-calendar-button-react";
import AlertMsg from "@/components/AlertMsg";

export default function Register({ session, type }) {
  const [alert, setAlert] = useState({ text: "", severity: "" });

  const register = async () => {
    try {
      const response = await fetch(`/api/events/register/${type}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: session?.user }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success === false) {
        throw new Error(data.message);
      }

      setAlert({
        text: `Te-ai înscris cu succes`,
        severity: "success",
      });
    } catch (error) {
      setAlert({ text: `${error}`, severity: "error" });
    }
  };

  const unregister = async () => {
    try {
      const response = await fetch(`/api/events/register/${type}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: session?.user.id }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success === false) {
        throw new Error(data.message);
      }

      setAlert({
        text: `Ai anulat înscrierea cu succes`,
        severity: "success",
      });
    } catch (error) {
      setAlert({ text: `${error}`, severity: "error" });
    }
  };

  return (
    <Box className={styles.grid}>
      <Box className={styles.card}>
        <Typography>
          Pentru a te înscrie la Seara de Catan trebuie ca mai întâi să fii{" "}
          <Link href="/api/auth/signin">logat</Link>
        </Typography>
        <Button
          variant="contained"
          className="btn btn-primary"
          onClick={register}
        >
          Înscriere
        </Button>
      </Box>

      <Box className={styles.card}>
        <Typography>
          Te rugăm să folosești această opțiune atunci când dorești să îți
          anulezi participarea
        </Typography>
        <Button
          variant="contained"
          className="btn btn-primary"
          onClick={unregister}
        >
          Anulează înscriere
        </Button>
      </Box>

      <Box className={styles.card}>
        <Typography>
          Dacă dorești să-ți salvezi data evenimentului în calendar, click mai
          jos:
        </Typography>

        <Box textAlign={"center"}>
          <AddToCalendarButton
            name={type}
            options={["Apple", "Google", "iCal"]}
            location="AGames"
            startDate="2024-05-05"
            endDate="2024-05-05"
            startTime="19:15"
            endTime="23:00"
            timeZone="Europe/Bucharest"
          >
            Calendar
          </AddToCalendarButton>
        </Box>
      </Box>
      <AlertMsg alert={alert} />
    </Box>
  );
}

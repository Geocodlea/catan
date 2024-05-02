"use client";

import styles from "@/app/page.module.css";
import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";

import { AddToCalendarButton } from "add-to-calendar-button-react";

export default function Register({ session, type }) {
  const register = async () => {
    fetch(`/api/register/${type}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: session.user }),
    });
  };

  const unregister = async () => {
    fetch(`/api/register/${type}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: session.user.id }),
    });
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
    </Box>
  );
}

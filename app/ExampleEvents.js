import Image from "next/image";

import styles from "../app/page.module.css";
import { Box, Paper, Typography, Button, Skeleton } from "@mui/material";

import dbConnect from "/utils/dbConnect";
import Event from "/models/Event";

const ExampleEvents = async () => {
  await dbConnect();
  const event = await Event.findOne({ title: "Galaxy" });

  return (
    <>
      <Typography variant="h2" fontWeight="bold" mt={16} mb={4} align="center">
        Example Views
      </Typography>
      <Box className={styles.grid}>
        <Box textAlign="center">
          <Typography variant="h4" fontWeight="bold" mb="10px">
            Admin user
          </Typography>
          <Paper
            elevation={24}
            className={styles.card}
            style={{
              padding: 0,
              textAlign: "center",
            }}
          >
            <Box sx={{ position: "relative", height: "300px" }}>
              <Image
                alt="bg"
                src={event.image}
                fill
                sizes="(max-width: 768px) 100vw"
                style={{
                  objectFit: "cover",
                }}
              />
              <Typography
                variant="h3"
                color="grey.100"
                sx={{
                  position: "absolute",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "100%",
                  fontWeight: "bold",
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                  textShadow: "3px 3px 5px rgba(0, 0, 0, 0.7)",
                }}
              >
                {event.title}
              </Typography>
            </Box>
            <Box className={styles.description}>
              <p>{event.description}</p>
            </Box>
            <Typography className={styles.code}>
              {event.date.toLocaleString("ro-RO", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Typography>
            <Typography variant="overline" gutterBottom>
              {event.type}
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-around",
                padding: "1rem",
              }}
            >
              <Button variant="contained" className="btn btn-primary">
                Edit Event
              </Button>

              <Button variant="contained" className="btn btn-error">
                Delete Event
              </Button>
            </Box>
          </Paper>
        </Box>

        <Box textAlign="center">
          <Typography variant="h4" fontWeight="bold" mb="10px">
            Any user
          </Typography>
          <Paper
            elevation={24}
            className={styles.card}
            style={{
              padding: 0,
              textAlign: "center",
            }}
          >
            <Box sx={{ position: "relative", height: "300px" }}>
              <Image
                alt="bg"
                src={event.image}
                fill
                sizes="(max-width: 768px) 100vw"
                style={{
                  objectFit: "cover",
                }}
              />
              <Typography
                variant="h3"
                color="grey.100"
                sx={{
                  position: "absolute",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "100%",
                  fontWeight: "bold",
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                  textShadow: "3px 3px 5px rgba(0, 0, 0, 0.7)",
                }}
              >
                {event.title}
              </Typography>
            </Box>
            <Box className={styles.description}>
              <p>{event.description}</p>
            </Box>
            <Typography className={styles.code}>
              {event.date.toLocaleString("ro-RO", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Typography>
            <Typography variant="overline" gutterBottom>
              {event.type}
            </Typography>
          </Paper>
        </Box>
        <Box textAlign="center">
          <Typography variant="h4" fontWeight="bold" mb="10px">
            Loading
          </Typography>
          <Paper elevation={24}>
            <Skeleton variant="rounded" animation="wave" height={300} />
            <Skeleton
              variant="rectangular"
              height={120}
              sx={{ bgcolor: "grey.200" }}
            />
            <Skeleton
              variant="text"
              sx={{ fontSize: "2rem", margin: "10px 20%" }}
            />
            <Skeleton
              variant="text"
              sx={{ fontSize: "2rem", marginLeft: "30%", marginRight: "30%" }}
            />
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default ExampleEvents;

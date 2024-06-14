import styles from "/app/page.module.css";

import { Box, Paper, Skeleton, Typography, Stack } from "@mui/material";

export default function Loading() {
  return (
    <Paper
      elevation={24}
      className={styles.card}
      sx={{
        width: "100%",
        maxWidth: "600px",
        marginBottom: "13rem",
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          marginTop: "-10rem",
          marginBottom: "3rem",
        }}
      >
        <Skeleton
          variant="circular"
          animation="wave"
          width={250}
          height={250}
          sx={{ backgroundColor: "grey.200" }}
        />
      </Box>
      <Typography variant="h2">
        <Skeleton width="40%" />
      </Typography>

      <Stack spacing={2} alignItems="center">
        <Skeleton variant="rounded" width="100%" height={60} />
        <Skeleton variant="rounded" width="100%" height={60} />

        <Skeleton
          variant="rounded"
          width="30%"
          height={40}
          style={{
            marginLeft: "35%",
            marginRight: "35%",
            marginBottom: "3rem",
          }}
        />

        <Skeleton variant="rounded" width="100%" height="50vh" />

        <Skeleton
          variant="rounded"
          width="100%"
          height="10vh"
          style={{ margin: "3rem 0 1rem" }}
        />
        <Skeleton
          variant="rounded"
          width="30%"
          height={40}
          style={{
            marginLeft: "35%",
            marginRight: "35%",
          }}
        />
      </Stack>
    </Paper>
  );
}

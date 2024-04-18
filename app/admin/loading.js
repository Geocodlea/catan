import styles from "../page.module.css";

import { Box, Paper, Skeleton, Stack } from "@mui/material";

export default function Loading() {
  return (
    <>
      <Paper
        elevation={24}
        className={styles.card}
        sx={{
          width: "100%",
          maxWidth: "600px",
          marginBottom: "3rem",
        }}
      >
        <Stack spacing={2}>
          <Skeleton
            variant="rounded"
            width="80%"
            height={68}
            style={{ marginBottom: "2rem", alignSelf: "center" }}
          />
          <Skeleton variant="rounded" width="100%" height={56} />
          <Skeleton variant="rounded" swidth="100%" height={148} />
          <Skeleton variant="rounded" width="100%" height={56} />
          <Skeleton variant="rounded" width="100%" height={56} />
          <Skeleton variant="rounded" width="100%" height={56} />
          <Stack spacing={2} direction="row" sx={{ justifyContent: "center" }}>
            <Skeleton variant="rounded" width={24} height={24} />
            <Skeleton variant="text" width={51} />
          </Stack>
          <Box sx={{ textAlign: "center" }}>
            <Skeleton variant="rounded" width={111} height={36} />
          </Box>
        </Stack>
      </Paper>

      <Paper elevation={24} className={styles.card} sx={{ width: "100%" }}>
        <Stack spacing={2}>
          <Skeleton
            variant="rounded"
            width={250}
            height={68}
            style={{
              marginBottom: "2rem",
              alignSelf: "center",
            }}
          />
          <Skeleton variant="rounded" width="100%" height={500} />
        </Stack>
      </Paper>
    </>
  );
}

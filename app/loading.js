import styles from "./page.module.css";

import { Box, Paper, Skeleton } from "@mui/material";

const skeletons = [1, 2, 3, 4];

export default function Loading() {
  return (
    <>
      <Skeleton width="80%" className={styles.title} />
      <Skeleton
        variant="rounded"
        width="100%"
        height="18vh"
        sx={{ margin: "1rem 0 3rem" }}
      />

      <Box className={styles.grid}>
        {skeletons.map((skeleton) => (
          <Paper elevation={24} key={skeleton}>
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
        ))}
      </Box>

      <Skeleton
        variant="rounded"
        width="100%"
        height="50vh"
        sx={{ margin: "3rem 0" }}
      />

      <Skeleton
        variant="rounded"
        width="100%"
        height="50vh"
        sx={{ margin: "3rem 0" }}
      />
    </>
  );
}

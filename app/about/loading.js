import styles from "/app/page.module.css";

import { Box, Stack, Skeleton } from "@mui/material";

const skeletons = [1, 2, 3, 4];

export default function Loading() {
  return (
    <>
      <Skeleton width="70%" className={styles.title} />
      <Skeleton variant="rounded" width="100%" height="50vh" />
      <Skeleton
        variant="rounded"
        width={200}
        height={30}
        sx={{ margin: "2rem 0" }}
      />
      <Box className={styles.grid}>
        {skeletons.map((skeleton) => (
          <Stack
            spacing={1.5}
            sx={{ margin: "20px", alignItems: "center" }}
            key={skeleton}
          >
            <Skeleton variant="circular" width={80} height={80} />
            <Skeleton variant="rounded" width={85} height={32} />
            <Skeleton variant="rounded" width={100} height={20} />
            <Skeleton variant="rounded" width="100%" height={80} />
          </Stack>
        ))}
      </Box>
    </>
  );
}

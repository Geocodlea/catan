import styles from "./page.module.css";

import { Skeleton } from "@mui/material";

export default function Loading() {
  return (
    <>
      <Skeleton width="80%" className={styles.title} />

      <Skeleton
        variant="rounded"
        width="100%"
        height="50vh"
        sx={{ margin: "3rem 0" }}
      />
    </>
  );
}

import styles from "./page.module.css";

import { Typography } from "@mui/material";

export default function NotFound() {
  return (
    <>
      <Typography variant="h1" className={styles.title} color={"error"}>
        404
      </Typography>
      <Typography sx={{ fontSize: "2rem" }}>Page not found :(</Typography>
      <Typography sx={{ fontSize: "1rem" }}>
        Ooooups! Looks like you got lost
      </Typography>
    </>
  );
}

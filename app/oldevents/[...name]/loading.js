import { Skeleton, Typography } from "@mui/material";

export default function Loading() {
  return (
    <>
      <Skeleton>
        <Typography variant="h2">Clasament</Typography>
      </Skeleton>
      <Skeleton variant="rounded" width="100%" height="50vh" />
    </>
  );
}

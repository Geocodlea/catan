import { Skeleton } from "@mui/material";

export default function Loading() {
  return (
    <>
      <Skeleton width="70%" height={80} sx={{ margin: "1rem auto" }} />

      <Skeleton
        variant="rounded"
        width="100%"
        height="18vh"
        sx={{ margin: "1rem 0 3rem" }}
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

import { Skeleton, Stack } from "@mui/material";

export default function Loading() {
  return (
    <Stack spacing={3} alignItems="center" width={"100%"}>
      <Stack spacing={2} direction={"row"} width={"100%"}>
        <Skeleton variant="rounded" width="100%" height={40} />
        <Skeleton variant="rounded" width="100%" height={40} />
        <Skeleton variant="rounded" width="100%" height={40} />
        <Skeleton variant="rounded" width="100%" height={40} />
      </Stack>

      <Skeleton variant="rounded" width="100%" height={2} />

      <Skeleton variant="rounded" width="100%" height="50vh" />
    </Stack>
  );
}

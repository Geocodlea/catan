import { Skeleton, Stack } from "@mui/material";

export default function Loading() {
  return (
    <Stack spacing={2} width="250px">
      <Skeleton variant="rounded" height={45} />
      {/* <Skeleton variant="rounded" height={45} />
      <Skeleton variant="rounded" height={45} />
      <Skeleton variant="rounded" height={45} /> */}
      <Skeleton variant="rounded" height={1} />
      <Skeleton variant="rounded" height={56} />
      <Skeleton variant="rounded" height={45} />
    </Stack>
  );
}

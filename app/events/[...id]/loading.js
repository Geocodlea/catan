import { Skeleton, Stack } from "@mui/material";

export default function Loading() {
  return (
    <Stack spacing={3} width={"100%"}>
      <Stack spacing={6} direction={"row"} width={"100%"} overflow="hidden">
        <Skeleton variant="rounded" width={58} height={24} />
        <Skeleton
          variant="rounded"
          width={60}
          height={24}
          sx={{ flexShrink: 0 }}
        />
        <Skeleton
          variant="rounded"
          width={90}
          height={24}
          sx={{ flexShrink: 0 }}
        />
        <Skeleton
          variant="rounded"
          width={80}
          height={24}
          sx={{ flexShrink: 0 }}
        />
        <Skeleton
          variant="rounded"
          width={90}
          height={24}
          sx={{ flexShrink: 0 }}
        />
        <Skeleton
          variant="rounded"
          width={60}
          height={24}
          sx={{ flexShrink: 0 }}
        />
      </Stack>

      <Skeleton variant="rounded" width="100%" height={2} />

      <Skeleton variant="rounded" width="100%" height="50vh" />
    </Stack>
  );
}

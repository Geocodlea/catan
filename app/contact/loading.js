import { Skeleton, Stack } from "@mui/material";

export default function Loading() {
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={{ xs: 4, md: 8 }}
      sx={{ width: "100%" }}
    >
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Skeleton variant="rounded" width="80%" height={40} />
        <Skeleton variant="rounded" width="100%" height={56} />
        <Skeleton variant="rounded" width="100%" height={56} />
        <Skeleton variant="rounded" width="100%" height={56} />
        <Skeleton variant="rounded" width="100%" height={148} />
      </Stack>

      <Stack
        spacing={4}
        sx={{ justifyContent: "center", alignSelf: "center", width: "50%" }}
      >
        <Stack spacing={2} direction="row">
          <Skeleton variant="circular" width={40} height={40} />
          <Stack spacing={2} sx={{ width: "100%" }}>
            <Skeleton variant="rounded" width="100%" height={40} />
            <Skeleton variant="rounded" width="100%" height={120} />
          </Stack>
        </Stack>
        <Stack spacing={2} direction="row">
          <Skeleton variant="circular" width={40} height={40} />
          <Stack spacing={2} sx={{ width: "100%" }}>
            <Skeleton variant="rounded" width="100%" height={40} />
            <Skeleton variant="rounded" width="100%" height={120} />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}

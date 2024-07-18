import { Paper, Skeleton, Stack, Typography } from "@mui/material";

export default function Loading() {
  return (
    <>
      <Paper elevation={24} className="form-paper">
        <Stack spacing={2}>
          <Skeleton>
            <Typography variant="h2">Create Event</Typography>
          </Skeleton>
          <Skeleton variant="rounded" width="100%" height={56} />
          <Skeleton variant="rounded" swidth="100%" height={148} />
          <Skeleton variant="rounded" width="100%" height={56} />
          <Skeleton variant="rounded" width="100%" height={56} />
          <Skeleton variant="rounded" width="100%" height={56} />

          <Skeleton
            variant="rounded"
            width={134}
            height={36}
            sx={{ alignSelf: "center" }}
          />
        </Stack>
      </Paper>

      <Stack spacing={2} width="100%">
        <Skeleton sx={{ alignSelf: "center" }}>
          <Typography variant="h2">Users</Typography>
        </Skeleton>
        <Skeleton variant="rounded" width="100%" height="50vh" />
      </Stack>
    </>
  );
}

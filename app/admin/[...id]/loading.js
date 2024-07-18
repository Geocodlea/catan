import { Typography, Paper, Skeleton, Stack } from "@mui/material";

export default function Loading() {
  return (
    <Paper
      elevation={24}
      sx={{
        width: "100%",
        maxWidth: "750px",
        marginBottom: "3rem",
        padding: ["1rem 2rem", "2rem 4rem"],
      }}
    >
      <Stack spacing={2}>
        <Skeleton>
          <Typography variant="h2">Update Event</Typography>
        </Skeleton>

        <Skeleton variant="rounded" width="100%" height={56} />
        <Skeleton variant="rounded" swidth="100%" height={148} />
        <Skeleton variant="rounded" width="100%" height={56} />
        <Skeleton variant="rounded" width="100%" height={56} />

        <Skeleton
          variant="rounded"
          width={135}
          height={36}
          sx={{ alignSelf: "center" }}
        />
      </Stack>
    </Paper>
  );
}

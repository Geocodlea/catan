import { Box, Paper, Skeleton, Typography, Stack } from "@mui/material";

export default function Loading() {
  return (
    <Paper elevation={24} className="form-paper">
      <Box
        sx={{
          textAlign: "center",
          marginTop: "-10rem",
          marginBottom: "3rem",
        }}
      >
        <Skeleton
          variant="circular"
          animation="wave"
          width={250}
          height={250}
          sx={{ backgroundColor: "grey.200", margin: "0 auto" }}
        />
      </Box>

      <Stack spacing={2}>
        <Skeleton>
          <Typography variant="h2">Profile</Typography>
        </Skeleton>
        <Skeleton variant="rounded" width="100%" height={56} />
        <Skeleton variant="rounded" width="100%" height={56} />
        <Skeleton variant="rounded" width="100%" height={56} />
        <Skeleton variant="rounded" width={"60%"} height={41} />
        <Skeleton
          variant="rounded"
          width={160}
          height={36}
          style={{ margin: "1rem auto 3rem" }}
        />

        <Skeleton>
          <Typography variant="h2">Istoric Participări</Typography>
        </Skeleton>
        <Skeleton variant="rounded" width="100%" height="50vh" />

        <Box pt={8}>
          <Skeleton variant="rounded" width="100%" height="10vh" />
          <Skeleton
            variant="rounded"
            width={160}
            height={36}
            style={{ margin: "1rem auto" }}
          />
        </Box>
      </Stack>
    </Paper>
  );
}

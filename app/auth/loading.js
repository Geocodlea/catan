import { Stack, Skeleton, Typography } from "@mui/material";

export default function Loading() {
  return (
    <Stack spacing={2}>
      <Skeleton>
        <Typography variant="h1" gutterBottom>
          ERROR
        </Typography>
      </Skeleton>
      <Skeleton>
        <Typography variant="h4" gutterBottom>
          Error message
        </Typography>
      </Skeleton>
    </Stack>
  );
}

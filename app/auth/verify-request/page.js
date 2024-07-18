"use client";

import Link from "next/link";
import { Stack, Typography } from "@mui/material";

export default function VerifyRequest() {
  return (
    <Stack spacing={4} sx={{ textAlign: "center" }} m={4}>
      <Typography variant="h3" gutterBottom>
        Check your email
      </Typography>
      <Typography variant="h5" gutterBottom>
        A sign in link has been sent to your email address.
      </Typography>
      <Link href="/">
        <Typography variant="overline" gutterBottom>
          Return to Homepage
        </Typography>
      </Link>
    </Stack>
  );
}

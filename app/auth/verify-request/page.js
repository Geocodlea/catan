"use client";

import Link from "next/link";
import { Stack } from "@mui/material";

export default function VerifyRequest() {
  return (
    <Stack spacing={4} sx={{ textAlign: "center" }}>
      <h1>Check your email</h1>
      <h3>A sign in link has been sent to your email address.</h3>
      <Link href="/">Return to Homepage</Link>
    </Stack>
  );
}

"use client";

import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let theme = createTheme({
  typography: {
    fontFamily:
      "General Sans, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
    h1: {
      fontWeight: 800,
      textShadow: "3px 3px 5px rgba(0, 0, 0, 0.5)",
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    body1: {
      textAlign: "justify",
    },
  },
});

theme = responsiveFontSizes(theme, { factor: 3 });

export default theme;

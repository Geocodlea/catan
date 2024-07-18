import "./globals.css";
import { ThemeProvider } from "@mui/material/styles";
import theme from "/context/theme";
import styles from "./page.module.css";

import React from "react";

import AuthProvider from "@/context/AuthProvider";

import AppBar from "@/components/Appbar";
import Banner from "@/components/Banner";
import Footer from "@/components/Footer";

import { Paper, Box } from "@mui/material";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";

export const metadata = {
  title: "Catan Romania",
  description: "Campionat National Catan Romania",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <AuthProvider>
              <AppBar />
              <Banner>
                <Box className={styles.main}>
                  <Paper elevation={24} className={styles.content}>
                    {children}
                  </Paper>
                </Box>
              </Banner>
              <Footer />
            </AuthProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

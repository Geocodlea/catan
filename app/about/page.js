import styles from "/app/page.module.css";

import { Box, Typography, Stack, Avatar } from "@mui/material";

export default async function About() {
  return (
    <>
      <h1 className={styles.title}>About Us</h1>
      <p className={styles.description} style={{ marginBottom: "2rem" }}>
        We're passionate about helping you bring your creative ideas to life. We
        understand the power of visuals and how they can transform your design
        concepts into reality. Our mission is to provide you with the most
        user-friendly, versatile, and innovative mockup tools on the web.
      </p>
      <Typography variant="h6" className={styles.code} mb={3}>
        Here is our team:
      </Typography>
      <Box className={styles.grid} sx={{ textAlign: "center" }}>
        <Stack spacing={1} sx={{ margin: "20px", alignItems: "center" }}>
          <Avatar
            alt="avatar"
            src="/img/pers1.jpeg"
            sx={{ width: 80, height: 80 }}
          />
          <Typography variant="h6">Elon Tusk</Typography>
          <Typography variant="overline">CEO / Founder</Typography>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Typography>
        </Stack>
        <Stack spacing={1} sx={{ margin: "20px", alignItems: "center" }}>
          <Avatar
            alt="avatar"
            src="/img/pers2.jpeg"
            sx={{ width: 80, height: 80 }}
          />
          <Typography variant="h6">Rita Cora</Typography>
          <Typography variant="overline">Web Engineer</Typography>
          <Typography>
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat.
          </Typography>
        </Stack>
        <Stack spacing={1} sx={{ margin: "20px", alignItems: "center" }}>
          <Avatar
            alt="avatar"
            src="/img/pers3.jpeg"
            sx={{ width: 80, height: 80 }}
          />
          <Typography variant="h6">Mark Berg</Typography>
          <Typography variant="overline">Web Developer</Typography>
          <Typography>
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur.
          </Typography>
        </Stack>
        <Stack spacing={1} sx={{ margin: "20px", alignItems: "center" }}>
          <Avatar
            alt="avatar"
            src="/img/pers4.jpeg"
            sx={{ width: 80, height: 80 }}
          />
          <Typography variant="h6">Angelina Molie</Typography>
          <Typography variant="overline">Web Designer</Typography>
          <Typography>
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
            officia deserunt mollit anim id est laborum.
          </Typography>
        </Stack>
      </Box>
    </>
  );
}

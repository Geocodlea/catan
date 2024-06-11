import styles from "/app/page.module.css";

import { Box, Typography, Stack, Avatar } from "@mui/material";

export default async function About() {
  return (
    <>
      <h1 className={styles.title}>About Us</h1>
      <p className={styles.description} style={{ marginBottom: "2rem" }}>
        Welcome to AGames, your ultimate destination for engaging and exciting
        board game events! Whether you're a seasoned strategist, a casual gamer,
        or someone just looking to have fun, we create unforgettable experiences
        tailored to every type of board game enthusiast. <br />
        <br />
        At AGames, we believe in the power of games to bring people together.
        Our mission is to foster community, creativity, and camaraderie through
        the love of board games. From classic favorites to modern masterpieces,
        our events cater to all tastes and skill levels. <br />
        <br />
        Join us for weekly game nights, themed tournaments, and special events
        that promise hours of entertainment and friendly competition. Our
        dedicated team of game masters ensures every event is welcoming and
        inclusive, so you can focus on what matters most: playing, laughing, and
        connecting with others. <br />
        <br />
        Discover your next favorite game and make lasting memories with us. Come
        roll the dice, draw the cards, and be part of our vibrant gaming
        community. Welcome to AGames, where every event is a game-changer!
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

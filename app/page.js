import styles from "./page.module.css";

import Events from "./Events";

import Leaderboard from "./Leaderboard";

export default async function Home({ searchParams }) {
  return (
    <>
      <h1 className={styles.title}>EVENIMENTE</h1>
      <p className={styles.description} style={{ marginBottom: "2rem" }}>
        TE AȘTEPTĂM LA CONCURSURI, JOCURI AMICALE SAU SESIUNI DE LEARN & PLAY,
        LIVE ȘI ONLINE, LA CELE MAI POPULARE BOARD GAMES.
      </p>

      <Events searchParams={searchParams} />

      <Leaderboard />

      {/* <OldEvents /> */}
    </>
  );
}

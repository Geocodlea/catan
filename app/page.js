import styles from "./page.module.css";

import Events from "./Events";
import OldEvents from "./OldEvents";

const Home = ({ searchParams }) => {
  return (
    <>
      <h1 className={styles.title}>Etape Locale</h1>
      <Events searchParams={searchParams} />
      <OldEvents />
    </>
  );
};

export default Home;

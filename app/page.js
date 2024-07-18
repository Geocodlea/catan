import Events from "./Events";
import OldEvents from "./OldEvents";

import { Typography } from "@mui/material";

const Home = () => {
  return (
    <>
      <Typography variant="h1" gutterBottom>
        Etape Locale
      </Typography>

      <Events />
      <OldEvents />
    </>
  );
};

export default Home;

"use client";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const AllEvents = ({ allEvents }) => {
  return (
    <Box textAlign={"center"} mt={2}>
      <Button
        variant="contained"
        className="btn btn-primary"
        onClick={allEvents}
      >
        Vezi Toate
      </Button>
    </Box>
  );
};

export default AllEvents;

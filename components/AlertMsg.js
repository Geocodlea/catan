"use client";

import { useState, useEffect } from "react";

import { Alert, Snackbar } from "@mui/material";

const AlertMsg = ({ alert }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, [alert]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      {alert.text && (
        <Snackbar
          open={open}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          key={"bottom" + "center"}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity={alert.severity}>
            {alert.text}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default AlertMsg;

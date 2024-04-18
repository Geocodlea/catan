"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import AlertMsg from "/components/AlertMsg";

import { useSession, signOut } from "next-auth/react";

export default function DeleteAccount() {
  const [alert, setAlert] = useState({ text: "", severity: "" });
  const [open, setOpen] = useState(false);

  const { data: session } = useSession();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        // Check for non-successful HTTP status codes
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setAlert({ text: "Account deleted successfully", severity: "success" });
    } catch (error) {
      // Handle any errors that occurred during the fetch operation
      setAlert({ text: "Error deleting account", severity: "error" });
    }

    signOut();
  };

  return (
    <div>
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button
          className="btn btn-error"
          variant="contained"
          onClick={handleOpen}
        >
          Delete Account
        </Button>
      </Box>
      <Dialog disableScrollLock={true} open={open} onClose={handleClose}>
        <DialogTitle>Delete Account?</DialogTitle>
        <DialogContent dividers>
          <DialogContentText>
            Are you sure you want to delete your account? There is no coming
            back from this, the account will be permanently deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            className="btn btn-primary"
            onClick={handleClose}
            sx={{ marginRight: "10px" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            className="btn btn-error"
            onClick={() => {
              handleClose();
              handleDelete(session.user.id);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <AlertMsg alert={alert} />
    </div>
  );
}

import { useState } from "react";
import {
  Box,
  Grid,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
} from "@mui/material";

const avatarOptions = [
  "/avatars/1.jpg",
  "/avatars/2.jpg",
  "/avatars/3.jpg",
  "/avatars/4.jpg",
  "/avatars/5.jpg",
  "/avatars/6.jpg",
  "/avatars/7.jpg",
  "/avatars/8.jpg",
  "/avatars/9.jpg",
  "/avatars/1ai.jpg",
  "/avatars/2ai.jpg",
  "/avatars/3ai.jpg",
  "/avatars/4ai.jpg",
  "/avatars/5ai.jpg",
  "/avatars/6ai.jpg",
];
const AvatarSelection = ({ onSelect }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleAvatarSelect = (avatar) => {
    onSelect(avatar);
    handleClose();
  };

  return (
    <Box>
      <Button
        variant="contained"
        className="btn btn-primary"
        onClick={handleOpen}
      >
        Choose Avatar
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Choose Avatar</DialogTitle>
        <DialogContent>
          <Grid container spacing={6}>
            {avatarOptions.map((avatar) => (
              <Grid item key={avatar}>
                <Avatar
                  src={avatar}
                  alt="Avatar"
                  onClick={() => handleAvatarSelect(avatar)}
                  sx={{
                    cursor: "pointer",
                    width: "90px",
                    height: "90px",
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AvatarSelection;

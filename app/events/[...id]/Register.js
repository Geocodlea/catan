"use client";

import { Button } from "@mui/material";

export default function Register({ session, type }) {
  const register = async () => {
    fetch(`/api/register/${type}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: session.user }),
    });
  };

  const unregister = async () => {
    fetch(`/api/register/${type}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: session.user.id }),
    });
  };

  return (
    <div>
      <Button
        variant="contained"
        className="btn btn-primary"
        onClick={register}
      >
        Inscriere
      </Button>
      <Button
        variant="contained"
        className="btn btn-primary"
        onClick={unregister}
      >
        Anulează înscrierea
      </Button>
    </div>
  );
}

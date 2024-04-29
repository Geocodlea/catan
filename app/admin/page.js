import { authOptions } from "../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

import styles from "../page.module.css";
import { Paper, Typography } from "@mui/material";

import CreateEventForm from "./CreateEventForm";
import EditableDataGrid from "@/components/EditableDataGrid";

import dbConnect from "/utils/dbConnect";
import User from "/models/User";

export default async function Admin() {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "admin") redirect(`/`);

  await dbConnect();
  const users = await User.find();

  const filteredUsers = users.map((user, i) => ({
    id: user.id,
    no: i + 1,
    name: user.name,
    email: user.email,
    role: user.role,
  }));

  console.log(filteredUsers);
  const columnsData = [
    {
      field: "id",
      headerName: "id",
    },
    {
      field: "no",
      headerName: "Nr.",
      width: 50,
    },
    {
      field: "name",
      headerName: "Name",
      editable: true,
      width: 150,
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      editable: true,
      width: 150,
    },
    {
      field: "role",
      headerName: "Role",
      editable: true,
      width: 50,
    },
  ];

  return (
    <>
      <Paper
        elevation={24}
        className={styles.card}
        sx={{ maxWidth: "600px", marginBottom: "5rem", textAlign: "center" }}
      >
        <Typography variant="h2">Create Event</Typography>
        <CreateEventForm />
      </Paper>
      <Typography variant="h3">Clasament</Typography>
      <EditableDataGrid
        columnsData={columnsData}
        rowsData={filteredUsers}
        pageSize={50}
        density={"compact"}
        showActions={true}
      />
    </>
  );
}

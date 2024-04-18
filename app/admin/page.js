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

  const filteredUsers = users.map((user) => ({
    _id: user._id.toHexString(),
    name: user.name,
    email: user.email,
    role: user.role,
  }));

  const columnsData = [
    {
      field: "_id",
      headerName: "_id",
      editable: false,
      width: 100,
      flex: 1,
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
      flex: 1,
    },
    {
      field: "role",
      headerName: "Role",
      editable: true,
      width: 100,
      flex: 0.3,
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
      <Paper
        elevation={24}
        className={styles.card}
        sx={{ width: "100%", textAlign: "center" }}
      >
        <Typography variant="h2">Users</Typography>
        <EditableDataGrid
          columnsData={columnsData}
          data={filteredUsers}
          apiURL={"users"}
          uniqueField={"_id"}
          alertText={"user"}
          showAddRecord={false}
          hiddenField={"_id"}
        />
      </Paper>
    </>
  );
}

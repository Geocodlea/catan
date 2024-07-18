import { authOptions } from "/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

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
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }));

  const columnsData = [
    {
      field: "id",
      headerName: "id",
    },
    {
      field: "nr",
      headerName: "Nr.",
      width: 50,
    },
    {
      field: "name",
      headerName: "Name",
      editable: true,
      minWidth: 200,
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      editable: true,
      width: 200,
    },
    {
      field: "role",
      headerName: "Role",
      editable: true,
      width: 80,
    },
  ];

  return (
    <>
      <Paper
        elevation={24}
        sx={{
          width: "100%",
          maxWidth: "750px",
          marginBottom: "3rem",
          padding: ["1rem 2rem", "2rem 4rem"],
        }}
      >
        <Typography variant="h2">Create Event</Typography>
        <CreateEventForm />
      </Paper>
      <Typography variant="h2">Users</Typography>
      <EditableDataGrid
        columnsData={columnsData}
        rowsData={filteredUsers}
        pageSize={50}
        density={"compact"}
        showActions={true}
        showAddRecord={true}
        apiURL={"/users"}
        alertText={"User"}
      />
    </>
  );
}

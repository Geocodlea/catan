import { authOptions } from "../../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import dynamic from "next/dynamic";

import dbConnect from "/utils/dbConnect";
import Event from "/models/Event";

import Tabs from "@/components/Tabs";
const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

import Stack from "@mui/material/Stack";
import Register from "./Register";
import Participants from "./Participants";
import Amical from "./Amical";
import Admin from "./Admin";

export default async function EventPage({ params }) {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user.role === "admin";

  await dbConnect();
  const event = await Event.findOne({ _id: params.id[1] }).select(
    "detalii premii regulament"
  );

  const saveData = async (data, tab) => {
    "use server";
    await Event.updateOne({ _id: params.id[1] }, { [tab]: data });
  };

  const editorContent = (event, tab) =>
    isAdmin ? (
      <Editor saveData={saveData} initialData={event[tab]} tab={tab} />
    ) : (
      <div dangerouslySetInnerHTML={{ __html: event[tab] }} />
    );

  const tabs = [
    {
      label: "Detalii",
      content: editorContent(event, "detalii"),
    },
    {
      label: "Premii",
      content: editorContent(event, "premii"),
    },
    {
      label: "Regulament",
      content: editorContent(event, "regulament"),
    },
    {
      label: "Inscriere",
      content: <Register session={session} type={params.id[0]} />,
    },
  ];

  if (isAdmin) {
    tabs.push(
      {
        label: "Participanti",
        content: (
          <Stack spacing={4}>
            <Participants type={params.id[0]} />
            <Amical type={params.id[0]} />
          </Stack>
        ),
      },
      {
        label: "Admin",
        content: <Admin type={params.id[0]} />,
      }
    );
  }

  return (
    <div className="editorContent">
      <Tabs tabContents={tabs} />
    </div>
  );
}

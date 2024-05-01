import dbConnect from "/utils/dbConnect";
import Event from "/models/Event";

import Tabs from "@/components/Tabs";

import dynamic from "next/dynamic";
const Test = dynamic(() => import("./Test"), { ssr: false });

import { authOptions } from "../../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export default async function EventPage({ params }) {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user.role === "admin";

  await dbConnect();
  const events = await Event.find({ _id: params.id }).select("detalii");

  const textFromMongoDB = events[0].detalii;

  return (
    <>
      {/* <Tabs
        tabContents={[
          {
            label: "Detalii",
            content: detalii,
          },
        ]}
      /> */}
      {isAdmin && <Test />}
    </>
  );
}

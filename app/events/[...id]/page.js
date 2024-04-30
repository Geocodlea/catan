import dbConnect from "/utils/dbConnect";
import Event from "/models/Event";

import Tabs from "@/components/Tabs";

export default async function EventPage({ params }) {
  await dbConnect();
  const events = await Event.find({ _id: params.id }).select("detalii");

  const textFromMongoDB = events[0].detalii;

  const detalii = <p dangerouslySetInnerHTML={{ __html: textFromMongoDB }} />;

  return (
    <Tabs
      tabContents={[
        {
          label: "Detalii",
          content: detalii,
        },
      ]}
    />
  );
}

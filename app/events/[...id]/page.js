"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Tabs from "@/components/Tabs";
const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

import AlertMsg from "@/components/AlertMsg";
import Stack from "@mui/material/Stack";
import Register from "./Register";
import Participants from "./Participants";
import Amical from "./Amical";
import Admin from "./Admin";
import PersonalMatch from "./PersonalMatch";
import Matches from "./Matches";
import Ranking from "./Ranking";

export default function EventPage({ params }) {
  const eventType = params.id[0];
  const id = params.id[1];
  const { data: session } = useSession();
  const [round, setRound] = useState(0);
  const [event, setEvent] = useState({});
  const [eventStarted, setEventStarted] = useState(false);
  const [alert, setAlert] = useState({ text: "", severity: "" });
  const isAdmin = session?.user.role === "admin";

  const saveData = async (data, tab) => {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data,
          tab,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setAlert({
        text: `Saved`,
        severity: "success",
      });
    } catch (error) {
      setAlert({ text: `${error}`, severity: "error" });
    }
  };

  const editorContent = (event, tab) =>
    isAdmin ? (
      <Editor saveData={saveData} initialData={event[tab]} tab={tab} />
    ) : (
      <div dangerouslySetInnerHTML={{ __html: event[tab] || "" }} />
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
  ];

  if (!eventStarted) {
    tabs.push({
      label: "Inscriere",
      content: <Register session={session} type={eventType} />,
    });
  }

  if (isAdmin || eventStarted) {
    tabs.push({
      label: "Participanti",
      content: (
        <Stack spacing={4}>
          <Participants type={eventType} />
          {isAdmin && <Amical type={eventType} />}
        </Stack>
      ),
    });
  }

  if (eventStarted) {
    tabs.push(
      {
        label: "Meci Propriu",
        content: (
          <PersonalMatch
            type={eventType}
            round={round}
            userID={session?.user.id}
            playerName={session?.user.name}
          />
        ),
      },
      { label: "Meciuri", content: <Matches /> },
      { label: "Clasament", content: <Ranking /> }
    );
  }

  if (isAdmin) {
    tabs.push({
      label: "Admin",
      content: <Admin type={eventType} id={id} round={round} />,
    });
  }

  useEffect(() => {
    const getRound = async () => {
      const response = await fetch(`/api/events/round/${eventType}`);
      const round = await response.json();
      setRound(round);
    };

    getRound();
    const intervalId = setInterval(getRound, 10000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const getEvent = async () => {
      const response = await fetch(`/api/events/${id}`);
      const event = await response.json();
      setEvent(event);
    };

    getEvent();
  }, []);

  useEffect(() => {
    round === 0 ? setEventStarted(false) : setEventStarted(true);
  }, [round, event, isAdmin]);

  return (
    <div className="editorContent">
      <Tabs tabContents={tabs} />
      <AlertMsg alert={alert} />
    </div>
  );
}

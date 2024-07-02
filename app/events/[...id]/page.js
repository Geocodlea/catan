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
import Admin from "./Admin";
import PersonalMatch from "./PersonalMatch";
import Matches from "./Matches";
import Ranking from "./Ranking";

export default function EventPage({ params }) {
  const [type, id] = params.id;
  const { data: session } = useSession();
  const [round, setRound] = useState(0);
  const [isFinalRound, setIsFinalRound] = useState(false);
  const [event, setEvent] = useState({});
  const [eventStarted, setEventStarted] = useState(false);
  const [alert, setAlert] = useState({ text: "", severity: "" });
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
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
    isAdmin || isOrganizer ? (
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
      content: <Register session={session} type={type} />,
    });
  }

  if (isAdmin || isOrganizer || eventStarted) {
    tabs.push({
      label: "Participanti",
      content: (
        <Stack spacing={4}>
          <Participants
            type={type}
            round={round}
            isAdmin={isAdmin}
            isOrganizer={isOrganizer}
          />
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
            type={type}
            round={round}
            host={session?.user.name}
            isAdmin={isAdmin}
            isOrganizer={isOrganizer}
            userID={session?.user.id}
            eventID={id}
          />
        ),
      },
      {
        label: "Meciuri",
        content: (
          <Matches
            type={type}
            round={round}
            host={session?.user.name}
            isAdmin={isAdmin}
            isOrganizer={isOrganizer}
          />
        ),
      }
    );
  }

  if (eventStarted && (isAdmin || isOrganizer || isFinished)) {
    tabs.push({
      label: "Clasament",
      content: <Ranking type={type} round={round} />,
    });
  }

  if (isAdmin || isOrganizer) {
    tabs.push({
      label: "Admin",
      content: (
        <Admin
          type={type}
          round={round}
          isFinalRound={isFinalRound}
          eventID={id}
        />
      ),
    });
  }

  useEffect(() => {
    const getRound = async () => {
      const response = await fetch(`/api/events/round/${type}`);
      const data = await response.json();
      setRound(data.round);
      setIsFinalRound(data.isFinalRound);
      setIsFinished(data.isFinished);
    };

    getRound();
    const interval = setInterval(getRound, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const getEvent = async () => {
      const response = await fetch(`/api/events/${id}`);
      const event = await response.json();

      if (session?.user.id === event.organizer) {
        setIsOrganizer(true);
      }

      setEvent(event);
    };

    getEvent();
  }, [session]);

  useEffect(() => {
    round === 0 ? setEventStarted(false) : setEventStarted(true);
  }, [round, event, isAdmin, isOrganizer]);

  return (
    <div className="editorContent">
      <Tabs tabContents={tabs} />
      <AlertMsg alert={alert} />
    </div>
  );
}

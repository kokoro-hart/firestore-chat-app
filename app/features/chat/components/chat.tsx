"use client";
import { Button, Textarea, useAutoResizeTextArea } from "@/app/components/ui";
import { db } from "@/firebase";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import React, { Fragment, Suspense, useEffect, useRef, useState } from "react";
import { BsSend } from "react-icons/bs";
import OpenAI from "openai";
import { useParams } from "next/navigation";
import { useGetMessages } from "../api";

type Message = {
  text: string;
  sender: "user" | "bot";
  createdAt: Timestamp;
};

const Messages = () => {
  const { data: messages } = useGetMessages();
  const scrollDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollDiv.current) {
      const element = scrollDiv.current;
      element.scrollTo({
        top: element.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);
  return (
    <div className="flex-grow overflow-y-auto font-bold" ref={scrollDiv}>
      {messages.map(({ sender, text }, index) => (
        <Fragment key={index}>
          {sender === "bot" && (
            <div className="tex-left">
              <div className="bg-muted inline-block rounded-lg px-4 py-2">
                <p className="font-sm font-normal">{text}</p>
              </div>
            </div>
          )}
          {sender === "user" && (
            <div className="text-right">
              <div className=" bg-black inline-block rounded-lg px-4 py-2">
                <p className="font-sm font-normal text-white">{text}</p>
              </div>
            </div>
          )}
        </Fragment>
      ))}
    </div>
  );
};

export const Chat = () => {
  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
    dangerouslyAllowBrowser: true,
  });
  const { roomId } = useParams();
  const [message, setMessage] = useState<string>();
  const { textAreaRef, handleChange } = useAutoResizeTextArea();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!message?.trim()) return;

    const messageData = {
      text: message,
      sender: "user",
      createdAt: serverTimestamp(),
    };

    const roomDoc = doc(db, "rooms", roomId.toString());
    const messageCollectionRef = collection(roomDoc, "messages");
    await addDoc(messageCollectionRef, messageData);

    setMessage("");
    setIsLoading(true);

    const gpt3Response = await openai.chat.completions.create({
      messages: [{ role: "user", content: message }],
      model: "gpt-3.5-turbo",
    });

    setIsLoading(false);

    const botResponse = gpt3Response.choices[0].message.content;
    await addDoc(messageCollectionRef, {
      text: botResponse,
      sender: "bot",
      createdAt: serverTimestamp(),
    });
  };

  return (
    <div className="flex flex-col justify-between gap-4 h-full max-w-[780px] w-full m-auto">
      <h1 className="text-2xl">Room1</h1>
      <Suspense fallback={<>loading</>}>
        <Messages />
      </Suspense>
      <div className="flex-shrink-0 relative flex gap-2 items-end">
        <Textarea
          defaultValue={message}
          ref={textAreaRef}
          rows={1}
          placeholder="send a message"
          onChange={(e) => {
            setMessage(e.target.value);
            handleChange(e);
          }}
        />
        <Button aria-label="send a message" onClick={handleSubmit}>
          <BsSend />
        </Button>
      </div>
    </div>
  );
};

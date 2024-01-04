"use client";
import { Button, Textarea, useAutoResizeTextArea } from "@/app/components/ui";
import { Timestamp } from "firebase/firestore";
import React, { Fragment, Suspense, useEffect, useRef, useState } from "react";
import { BsSend } from "react-icons/bs";
import { useCreateGtpMessage, useCreateMessage, useGetMessages } from "../api";

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
    <div className="flex-grow overflow-y-auto font-bold pr-4" ref={scrollDiv}>
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
  const [message, setMessage] = useState<string>();
  const { textAreaRef, handleChange } = useAutoResizeTextArea();
  const { mutateAsync: createMessage, isPending: isCreatingMessage } = useCreateMessage();
  const { mutateAsync: createGptMessage, isPending: isCreatingGtpMessage } = useCreateGtpMessage();

  const handleSubmit = async () => {
    if (!message?.trim()) return;
    createMessage({ text: message });
    createGptMessage({ text: message });
  };

  return (
    <div className="flex flex-col justify-between gap-4 h-full max-w-[780px] w-full m-auto">
      <h1 className="text-2xl">Room1</h1>
      <Suspense fallback={<>loading</>}>
        <Messages />
      </Suspense>
      {isCreatingGtpMessage && <p>loading</p>}
      {isCreatingMessage && <p className="text-right">loading</p>}
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

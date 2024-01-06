"use client";
import { Button, Form, Textarea, useAutoResizeTextArea } from "@/app/components/ui";
import React, { Fragment, Suspense, useRef } from "react";
import { BsSend } from "react-icons/bs";
import { useCreateGtpMessage, useCreateMessage, useGetMessages, useGetRoom } from "../api";
import { z } from "zod";

type MessageProps = {
  isCreatingUserMessage: boolean;
  isCreatingGptMessage: boolean;
};
const Messages = ({ isCreatingUserMessage, isCreatingGptMessage }: MessageProps) => {
  const { data: messages } = useGetMessages();
  const scrollDiv = useRef<HTMLDivElement>(null);

  const handleScrollDown = () => {
    if (scrollDiv.current) {
      const element = scrollDiv.current;
      element.scrollTo({
        top: element.scrollHeight,
        behavior: "smooth",
      });
    }
  };
  return (
    <div className="flex-grow overflow-y-auto font-bold pr-4" ref={scrollDiv}>
      {messages.map(({ sender, text }, index) => (
        <Fragment key={index}>
          {sender === "bot" && (
            <div className="tex-left mb-4">
              <div className="bg-muted inline-block rounded-lg px-4 py-2">
                <p className="font-sm font-normal">{text}</p>
              </div>
            </div>
          )}
          {sender === "user" && (
            <div className="text-right mb-4">
              <div className=" bg-primary inline-block rounded-lg px-4 py-2">
                <p className="font-sm font-normal text-white">{text}</p>
              </div>
            </div>
          )}
        </Fragment>
      ))}
      {isCreatingGptMessage && <p>loading</p>}
      {isCreatingUserMessage && <p className="text-right">loading</p>}
      <div className="sticky bottom-0 left-0 opacity-60">
        <Button onClick={handleScrollDown}>↓</Button>
      </div>
    </div>
  );
};

const messageSchema = z.object({
  text: z.string(),
});

export type MessageRequest = z.infer<typeof messageSchema>;

export const Chat = () => {
  const { textAreaRef, handleChange } = useAutoResizeTextArea();
  const { mutateAsync: createMessage, isPending: isCreatingUserMessage } = useCreateMessage();
  const { mutateAsync: createGptMessage, isPending: isCreatingGptMessage } = useCreateGtpMessage();

  const handleSubmit = async (data: MessageRequest) => {
    createMessage(data);
    createGptMessage(data);
    if (textAreaRef.current) textAreaRef.current.value = "";
  };

  const room = useGetRoom();

  return (
    <div className="flex flex-col justify-between gap-4 h-full max-w-[780px] w-full m-auto">
      <h1 className="text-2xl">{room?.name}</h1>
      <Suspense fallback={<>loading</>}>
        <Messages
          isCreatingUserMessage={isCreatingUserMessage}
          isCreatingGptMessage={isCreatingGptMessage}
        />
      </Suspense>
      <Form<MessageRequest, typeof messageSchema> onSubmit={handleSubmit} schema={messageSchema}>
        {({ register }) => (
          <div className="flex-shrink-0 relative flex gap-2 items-end">
            <Textarea
              rows={1}
              placeholder="send a message"
              {...register("text", {
                onChange: (e) => {
                  handleChange(e);
                },
              })}
              ref={textAreaRef}
              onKeyDown={(event) => {
                if (event.nativeEvent.isComposing || event.key !== "Enter" || isCreatingUserMessage)
                  return;
                if (
                  event.key === "Enter" &&
                  !event.shiftKey &&
                  event.currentTarget.value.trim() !== ""
                ) {
                  event.preventDefault();
                  handleSubmit({ text: event.currentTarget.value });
                }
              }}
            />
            <Button type="submit" aria-label="send a message">
              <BsSend />
            </Button>
          </div>
        )}
      </Form>
    </div>
  );
};

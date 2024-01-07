"use client";
import React, { Fragment, Suspense, useEffect } from "react";
import { BsSend } from "react-icons/bs";
import { z } from "zod";

import {
  Button,
  DotsBounce,
  Form,
  PageSpinner,
  Textarea,
  useAutoResizeTextArea,
} from "@/app/components/ui";
import { useScroll } from "@/app/hooks";

import { SENDER_TYPE } from "..";
import { useCreateGtpMessage, useCreateMessage, useGetMessages, useGetRoom } from "../api";

type MessageProps = {
  isCreatingUserMessage: boolean;
  isCreatingGptMessage: boolean;
};
const Messages = ({ isCreatingUserMessage, isCreatingGptMessage }: MessageProps) => {
  const { data: messages } = useGetMessages();
  return (
    <div className="flex flex-col gap-4">
      {messages.map(({ sender, text }, index) => (
        <Fragment key={index}>
          {sender === SENDER_TYPE.user && (
            <div className="text-right">
              <div className="inline-block rounded-lg bg-primary px-4 py-2">
                <p className="font-sm whitespace-pre-wrap text-left font-normal text-white">
                  {text}
                </p>
              </div>
            </div>
          )}
          {sender === SENDER_TYPE.bot && (
            <div className="tex-left">
              <div className="inline-block rounded-lg bg-muted px-4 py-2">
                <p className="font-sm whitespace-pre-wrap font-normal">{text}</p>
              </div>
            </div>
          )}
        </Fragment>
      ))}
      {isCreatingUserMessage && (
        <div className="text-right">
          <DotsBounce />
        </div>
      )}
      {isCreatingGptMessage && (
        <div className="text-left">
          <DotsBounce />
        </div>
      )}
    </div>
  );
};

const messageSchema = z.object({
  text: z.string(),
});

export type MessageRequest = z.infer<typeof messageSchema>;

export const Chat = () => {
  const { textAreaRef, handleChange, reset: resetTextArea } = useAutoResizeTextArea();
  const { mutateAsync: createMessage, isPending: isCreatingUserMessage } = useCreateMessage();
  const { mutateAsync: createGptMessage, isPending: isCreatingGptMessage } = useCreateGtpMessage();
  const { ref: scrollRef, scrollDown, moveDown } = useScroll();
  const { name: roomName } = useGetRoom();

  useEffect(() => {
    moveDown();
  }, [moveDown]);

  const handleSubmit = async (data: MessageRequest) => {
    resetTextArea();
    await createMessage(data);
    scrollDown();
    await createGptMessage(data);
    setTimeout(() => {
      scrollDown();
    }, 500);
  };

  return (
    <div className="flex h-full flex-col justify-between pb-2">
      <h1 className="text-2xl">{roomName}</h1>
      <div className="grow overflow-y-auto pb-10 font-bold" ref={scrollRef}>
        <div className="m-auto h-full w-full max-w-[780px]">
          <Suspense fallback={<PageSpinner />}>
            <div className="pb-14">
              <Messages
                isCreatingUserMessage={isCreatingUserMessage}
                isCreatingGptMessage={isCreatingGptMessage}
              />
            </div>
          </Suspense>
        </div>
      </div>
      <div className="m-auto w-full max-w-[780px]">
        <div className="relative">
          <div className="absolute left-1/2 top-0 -translate-x-[120%] -translate-y-[120%] opacity-50">
            <Button
              size="icon"
              className="rounded-full"
              onClick={scrollDown}
              aria-label="scroll down"
            >
              ↓
            </Button>
          </div>
          <Form<MessageRequest, typeof messageSchema>
            id="chat"
            onSubmit={handleSubmit}
            schema={messageSchema}
          >
            {({ register, setValue }) => (
              <div className="relative flex shrink-0 items-end gap-2">
                <Textarea
                  rows={1}
                  placeholder="send a message"
                  {...register("text", {
                    onChange: (e) => {
                      handleChange(e);
                      setValue("text", e.target.value);
                    },
                  })}
                  ref={textAreaRef}
                  onKeyDown={(event) => {
                    if (
                      event.nativeEvent.isComposing ||
                      event.key !== "Enter" ||
                      isCreatingUserMessage
                    )
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
                <Button type="submit" id="chat" aria-label="send a message">
                  <BsSend />
                </Button>
              </div>
            )}
          </Form>
        </div>
      </div>
    </div>
  );
};

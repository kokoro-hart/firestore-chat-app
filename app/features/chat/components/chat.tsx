"use client";
import {
  Button,
  DotsBounce,
  Form,
  PageSpinner,
  Textarea,
  useAutoResizeTextArea,
} from "@/app/components/ui";
import React, { Fragment, Suspense, useCallback, useEffect, useRef } from "react";
import { BsSend } from "react-icons/bs";
import { useCreateGtpMessage, useCreateMessage, useGetMessages, useGetRoom } from "../api";
import { z } from "zod";
import { SENDER_TYPE } from "..";
import { useScroll } from "@/app/hooks";

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
              <div className="bg-primary inline-block rounded-lg px-4 py-2">
                <p className="font-sm font-normal text-white whitespace-pre-wrap text-left">
                  {text}
                </p>
              </div>
            </div>
          )}
          {sender === SENDER_TYPE.bot && (
            <div className="tex-left">
              <div className="bg-muted inline-block rounded-lg px-4 py-2">
                <p className="font-sm font-normal whitespace-pre-wrap">{text}</p>
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
    <div className="flex flex-col justify-between h-full pb-2">
      <h1 className="text-2xl">{roomName}</h1>
      <div className="flex-grow overflow-y-auto font-bold pb-10" ref={scrollRef}>
        <div className="max-w-[780px] w-full h-full m-auto">
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
      <div className="max-w-[780px] w-full m-auto">
        <div className="relative">
          <div className="absolute top-0 left-1/2 opacity-50 -translate-y-[120%] -translate-x-[120%]">
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
              <div className="flex-shrink-0 relative flex gap-2 items-end">
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

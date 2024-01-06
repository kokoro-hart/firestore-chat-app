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
  return (
    <>
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
    </>
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
  const scrollDiv = useRef<HTMLDivElement>(null);
  const room = useGetRoom();

  const handleScrollDown = () => {
    if (scrollDiv.current) {
      const element = scrollDiv.current;
      element.scrollTo({
        top: element.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const handleSubmit = async (data: MessageRequest) => {
    if (textAreaRef.current) textAreaRef.current.value = "";
    await createMessage(data);
    handleScrollDown();
    await createGptMessage(data);
    setTimeout(() => {
      handleScrollDown();
    }, 500);
  };

  return (
    <div className="flex flex-col justify-between h-full pb-2">
      <h1 className="text-2xl">{room?.name}</h1>
      <div className="flex-grow overflow-y-auto font-bold pb-10" ref={scrollDiv}>
        <div className="max-w-[780px] w-full m-auto">
          <Suspense fallback={<>loading</>}>
            <Messages
              isCreatingUserMessage={isCreatingUserMessage}
              isCreatingGptMessage={isCreatingGptMessage}
            />
          </Suspense>
        </div>
      </div>
      <div className="max-w-[780px] w-full m-auto">
        <div className="relative">
          <div className="absolute top-0 left-1/2 opacity-50 -translate-y-[120%] -translate-x-[120%]">
            <Button
              size="icon"
              className="rounded-full"
              onClick={handleScrollDown}
              aria-label="scroll down"
            >
              ↓
            </Button>
          </div>
          <Form<MessageRequest, typeof messageSchema>
            onSubmit={handleSubmit}
            schema={messageSchema}
          >
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
                <Button type="submit" aria-label="send a message">
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

import { Button, Input, Textarea, useAutoResizeTextArea } from "@/app/components/ui";
import React from "react";
import { BsSend } from "react-icons/bs";

export const Chat = () => {
  const { textAreaRef, handleChange } = useAutoResizeTextArea();
  return (
    <div className="flex flex-col gap-4 h-full max-w-[780px] w-full m-auto">
      <h1 className="text-2xl">Room1</h1>
      <div className="flex-grow overflow-y-auto font-bold">
        <div className="tex-left">
          <div className="bg-muted inline-block rounded-lg px-4 py-2">
            <p className="font-sm font-normal">Hello test</p>
          </div>
        </div>
        <div className="text-right">
          <div className=" bg-black inline-block rounded-lg px-4 py-2">
            <p className="font-sm font-normal text-white">
              Hello testHello testHello testHello test Hello test Hello test Hello test Hello test
            </p>
          </div>
        </div>
      </div>
      <div className="flex-shrink-0 relative flex gap-2 items-end">
        <Textarea
          ref={textAreaRef}
          rows={1}
          placeholder="send a message"
          onChange={(e) => {
            handleChange(e);
          }}
        />
        <Button aria-label="send a message">
          <BsSend />
        </Button>
      </div>
    </div>
  );
};

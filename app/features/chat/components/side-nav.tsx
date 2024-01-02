import { Button } from "@/app/components/ui";
import { RiLogoutBoxLine } from "react-icons/ri";
import React from "react";

export const SideNav = () => {
  return (
    <div className="flex flex-col h-full">
      <Button className="w-full">New Chat</Button>
      <div className="flex-grow">
        <ul>
          <li className="py-4 px-6 border-b border-border">Room 1</li>
        </ul>
      </div>
      <Button className="bg-muted text-black flex items-center gap-2 hover:bg-gray-200">
        <RiLogoutBoxLine />
        Logout
      </Button>
    </div>
  );
};

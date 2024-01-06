"use client";
import { Button, ButtonLink } from "@/app/components/ui";
import { RiLogoutBoxLine } from "react-icons/ri";
import React, { Suspense } from "react";
import { auth } from "@/firebase";
import { useAuth } from "@/app/providers";
import { useCreateRoom, useGetRooms } from "../api";
import { getPath } from "@/app/utils";

const RoomList = () => {
  const { data: rooms } = useGetRooms();

  return (
    <ul>
      {rooms.map(({ id, name }) => (
        <li key={id}>
          <ButtonLink
            variant="ghost"
            className="py-4 px-6 border-b border-border w-full h-full"
            href={getPath.chat.room(id)}
          >
            {name}
          </ButtonLink>
        </li>
      ))}
    </ul>
  );
};

export const Rooms = () => {
  const { user } = useAuth();
  const { mutateAsync: createRoom } = useCreateRoom();

  const addNewRoom = async () => {
    const roomName = prompt("ルーム名を入力してください。");
    if (roomName) {
      createRoom({ name: roomName });
    }
  };

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <div className="flex flex-col h-full">
      <Button className="w-full" onClick={addNewRoom}>
        New Chat
      </Button>
      <div className="flex-grow">
        <Suspense fallback={<>loading</>}>
          <RoomList />
        </Suspense>
      </div>
      {user && <p className="p-4 text-md">{user.email}</p>}
      <Button
        className="bg-muted text-black flex items-center gap-2 hover:bg-gray-200"
        onClick={handleLogout}
      >
        <RiLogoutBoxLine />
        Logout
      </Button>
    </div>
  );
};

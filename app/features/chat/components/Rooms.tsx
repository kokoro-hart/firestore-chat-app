"use client";
import { Button, ButtonLink, Skeleton } from "@/app/components/ui";
import { RiLogoutBoxLine } from "react-icons/ri";
import React, { Suspense } from "react";
import { firebaseAuth } from "@/app/libs";
import { useAuth } from "@/app/providers";
import { useGetRooms } from "../api";
import { getPath } from "@/app/utils";
import { useParams } from "next/navigation";
import { CreateRoomDialog } from "./CreateRoomDialog";

const RoomList = () => {
  const { roomId } = useParams();
  const { data: rooms } = useGetRooms();

  return (
    <ul>
      {rooms.map(({ id, name }) => (
        <li key={id}>
          <ButtonLink
            variant="ghost"
            className={`py-4 px-6 border-b border-border rounded-none w-full h-full ${
              roomId === id && "bg-muted"
            }`}
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
  const handleLogout = () => {
    firebaseAuth.signOut();
  };
  return (
    <div className="flex flex-col h-full gap-4">
      <CreateRoomDialog />
      <div className="flex-grow">
        <Suspense fallback={<Skeleton className="w-full h-6 py-4 px-6 border-b border-border" />}>
          <RoomList />
        </Suspense>
      </div>
      <div className="flex flex-col">
        {user && <p className="p-4 text-md">{user.email}</p>}
        <Button
          className="bg-muted text-black flex items-center gap-2 hover:bg-gray-200"
          onClick={handleLogout}
        >
          <RiLogoutBoxLine />
          Logout
        </Button>
      </div>
    </div>
  );
};

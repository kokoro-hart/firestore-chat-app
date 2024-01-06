"use client";
import { Button, ButtonLink, DropdownWithTrigger, Skeleton } from "@/app/components/ui";
import { BsTrash3 } from "react-icons/bs";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { RiLogoutBoxLine } from "react-icons/ri";
import React, { Suspense } from "react";
import { firebaseAuth } from "@/app/libs";
import { useAuth } from "@/app/providers";
import { useDeleteRoom, useGetRooms } from "../api";
import { getPath } from "@/app/utils";
import { useParams } from "next/navigation";
import { CreateRoomDialog } from "./CreateRoomDialog";

const RoomList = () => {
  const { roomId } = useParams();
  const { data: rooms } = useGetRooms();
  const { mutateAsync: deleteRoom } = useDeleteRoom();

  return (
    <ul>
      {rooms.map(({ id, name }) => (
        <li
          key={id}
          className={`flex items-center justify-between hover:bg-muted border-b border-border ${
            roomId === id && "bg-muted"
          }`}
        >
          <ButtonLink
            variant="ghost"
            className={`py-3 px-6 rounded-none w-full h-full transition-none`}
            href={getPath.chat.room(id)}
          >
            {name}
          </ButtonLink>
          <DropdownWithTrigger
            list={[
              <button
                key="delete"
                className="w-full text-destructive gap-2 cursor-pointer"
                onClick={() => {
                  console.log("delete");
                  deleteRoom({ roomId: id });
                }}
              >
                <BsTrash3 />
                Delete Room
              </button>,
            ]}
            triggerButton={
              <Button
                aria-label="open room menu"
                className="hover:bg-gray-200"
                size="icon"
                variant="ghost"
              >
                <HiOutlineDotsHorizontal />
              </Button>
            }
          />
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

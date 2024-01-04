"use client";
import { Button } from "@/app/components/ui";
import { RiLogoutBoxLine } from "react-icons/ri";
import React, { Suspense } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/firebase";
import { useAuth } from "@/app/providers";
import { useGetRooms } from "../api";
import { roomAtom } from "../stores";
import { useSetAtom } from "jotai/react";

const RoomList = () => {
  const setRoom = useSetAtom(roomAtom);
  const { data: rooms } = useGetRooms();
  return (
    <ul>
      {rooms.map(({ id, name }) => (
        <li key={id}>
          <Button
            className="py-4 px-6 border-b border-border bg-transparent w-full h-full text-black hover:bg-gray-100"
            onClick={() => {
              setRoom((prev) => ({
                ...prev,
                id,
              }));
            }}
          >
            {name}
          </Button>
        </li>
      ))}
    </ul>
  );
};

export const SideNav = () => {
  const { user, userId } = useAuth();

  const addNewRoom = async () => {
    const roomName = prompt("ルーム名を入力してください。");
    if (roomName) {
      const newRoomRef = collection(db, "rooms");
      await addDoc(newRoomRef, {
        name: roomName,
        userId: userId,
        createdAt: serverTimestamp(),
      });
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

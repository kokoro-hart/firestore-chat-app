"use client";
import { Button } from "@/app/components/ui";
import { RiLogoutBoxLine } from "react-icons/ri";
import React, { useEffect, useState } from "react";
import {
  Timestamp,
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { auth, db } from "@/firebase";
import { useAuth } from "@/app/providers";

type Room = {
  id: string;
  name: string;
  createdAt: Timestamp;
};

export const SideNav = () => {
  const { user, userId, setSelectedRoom } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    if (user) {
      const fetchRooms = async () => {
        const roomCollection = collection(db, "rooms");
        const baseQuery = query(
          roomCollection,
          where("userId", "==", userId),
          orderBy("createdAt"),
        );
        const unsubscribe = onSnapshot(baseQuery, (snapshot) => {
          const newRooms: Room[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name,
            createdAt: doc.data().createdAt,
          }));
          setRooms(newRooms);
        });

        return () => {
          unsubscribe();
        };
      };

      fetchRooms();
    }
  }, [user, userId]);

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
        <ul className="mt-4">
          {rooms.map(({ id, name }) => (
            <li key={id}>
              <Button
                className="py-4 px-6 border-b border-border bg-transparent w-full h-full text-black hover:bg-gray-100"
                onClick={() => {
                  setSelectedRoom(id);
                }}
              >
                {name}
              </Button>
            </li>
          ))}
        </ul>
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

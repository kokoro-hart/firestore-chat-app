import { Timestamp } from "firebase/firestore";

export type Room = {
  id: string;
  name: string;
  createdAt: string;
};

export type GetRoomsResponse = Room[];

export type CreateRoomRequest = {
  userId: string;
  name: string;
};

export type DeleteRoomRequest = {
  roomId: string;
};

export type Message = {
  text: string;
  sender: "user" | "bot";
  createdAt: Timestamp;
};

export type GetMessagesResponse = Message[];

export type CreateMessageRequest = {
  roomId: string;
  text: string;
};

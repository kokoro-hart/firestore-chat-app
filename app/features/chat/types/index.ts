import { Timestamp } from "firebase/firestore";

export const SENDER_TYPE = {
  user: "user",
  bot: "bot",
} as const;

export type SenderType = (typeof SENDER_TYPE)[keyof typeof SENDER_TYPE];

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

export type UpdateRoomRequest = {
  roomId: string;
  name: string;
};

export type DeleteRoomRequest = {
  roomId: string;
};

export type Message = {
  text: string;
  sender: SenderType;
  createdAt: Timestamp;
};

export type GetMessagesResponse = Message[];

export type CreateMessageRequest = {
  roomId: string;
  text: string;
};

import { useToast } from "@/app/components/ui";
import { queryClient } from "@/app/libs";
import { useAuth } from "@/app/providers";
import { db } from "@/firebase";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { useParams } from "next/navigation";
import OpenAI from "openai";

const getRooms = async (userId: string) => {
  const roomCollection = collection(db, "rooms");
  const baseQuery = query(roomCollection, where("userId", "==", userId), orderBy("createdAt"));
  const snapshot = await getDocs(baseQuery);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name,
    createdAt: doc.data().createdAt,
  }));
};

export const useGetRooms = () => {
  const { userId } = useAuth();
  return useSuspenseQuery({
    queryKey: ["rooms", { userId }],
    queryFn: () => getRooms(userId ?? ""),
  });
};

type createRoomRequest = {
  userId: string;
  name: string;
};
const createRoom = async ({ userId, name }: createRoomRequest) => {
  const newRoomRef = collection(db, "rooms");
  await addDoc(newRoomRef, {
    name,
    userId,
    createdAt: serverTimestamp(),
  });
};

export const useCreateRoom = () => {
  const { userId } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationKey: ["rooms", { userId }],
    mutationFn: ({ name }: Pick<createRoomRequest, "name">) =>
      createRoom({
        userId: userId ?? "",
        name,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms", { userId }] });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Failed to create room.",
      });
    },
  });
};

type Message = {
  text: string;
  sender: "user" | "bot";
  createdAt: Timestamp;
};
const getMessages = async (roomId: string) => {
  const roomDocRef = doc(db, "rooms", roomId);
  const messagesCollectionRef = collection(roomDocRef, "messages");
  const q = query(messagesCollectionRef, orderBy("createdAt"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as Message);
};

export const useGetMessages = () => {
  const { roomId } = useParams();
  return useSuspenseQuery({
    queryKey: ["messages", { roomId }],
    queryFn: () => getMessages(roomId.toString()),
  });
};

type createMessageRequest = {
  roomId: string;
  text: string;
};
const createMessage = async ({ text, roomId }: createMessageRequest) => {
  const messageData = {
    text,
    sender: "user",
    createdAt: serverTimestamp(),
  };

  const roomDoc = doc(db, "rooms", roomId.toString());
  const messageCollectionRef = collection(roomDoc, "messages");
  await addDoc(messageCollectionRef, messageData);
};

export const useCreateMessage = () => {
  const { toast } = useToast();
  const { roomId } = useParams();

  return useMutation({
    mutationKey: ["messages", { roomId }],
    mutationFn: ({ text }: Pick<createMessageRequest, "text">) =>
      createMessage({
        text,
        roomId: roomId.toString(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", { roomId }] });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Failed to create message.",
      });
    },
  });
};

const createGtpMessage = async ({ text, roomId }: createMessageRequest) => {
  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
    dangerouslyAllowBrowser: true,
  });
  const gpt3Response = await openai.chat.completions.create({
    messages: [{ role: "user", content: text }],
    model: "gpt-3.5-turbo",
  });
  const roomDoc = doc(db, "rooms", roomId.toString());
  const messageCollectionRef = collection(roomDoc, "messages");
  const botResponse = gpt3Response.choices[0].message.content;
  await addDoc(messageCollectionRef, {
    text: botResponse,
    sender: "bot",
    createdAt: serverTimestamp(),
  });
};

export const useCreateGtpMessage = () => {
  const { toast } = useToast();
  const { roomId } = useParams();

  return useMutation({
    mutationKey: ["messages", { roomId }],
    mutationFn: ({ text }: Pick<createMessageRequest, "text">) =>
      createGtpMessage({
        text,
        roomId: roomId.toString(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", { roomId }] });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Failed to create message.",
      });
    },
  });
};

import { useToast } from "@/app/components/ui";
import { queryClient, firestore, openai } from "@/app/libs";
import { useAuth } from "@/app/providers";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { useParams } from "next/navigation";
import {
  CreateRoomRequest,
  GetMessagesResponse,
  GetRoomsResponse,
  Message,
  CreateMessageRequest,
  DeleteRoomRequest,
} from "../types";

const getRooms = async (userId: string): Promise<GetRoomsResponse> => {
  const roomCollection = collection(firestore, "rooms");
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

export const useGetRoom = () => {
  const { roomId } = useParams();
  const { data: rooms } = useGetRooms();
  const room = rooms.find(({ id }) => id === roomId);
  return room;
};

const createRoom = async ({ userId, name }: CreateRoomRequest) => {
  const newRoomRef = collection(firestore, "rooms");
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
    mutationFn: ({ name }: Pick<CreateRoomRequest, "name">) =>
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

const deleteRoom = async (roomId: string) => {
  await deleteDoc(doc(firestore, "rooms", roomId));
};

export const useDeleteRoom = () => {
  const { userId } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationKey: ["rooms", { userId }],
    mutationFn: ({ roomId }: DeleteRoomRequest) => deleteRoom(roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms", { userId }] });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Failed to delete room.",
      });
    },
  });
};

const getMessages = async (roomId: string): Promise<GetMessagesResponse> => {
  const roomDocRef = doc(firestore, "rooms", roomId);
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

const createMessage = async ({ text, roomId }: CreateMessageRequest) => {
  const messageData = {
    text,
    sender: "user",
    createdAt: serverTimestamp(),
  };

  const roomDoc = doc(firestore, "rooms", roomId.toString());
  const messageCollectionRef = collection(roomDoc, "messages");
  await addDoc(messageCollectionRef, messageData);
};

export const useCreateMessage = () => {
  const { toast } = useToast();
  const { roomId } = useParams();

  return useMutation({
    mutationKey: ["messages", { roomId }],
    mutationFn: ({ text }: Pick<CreateMessageRequest, "text">) =>
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

const createGtpMessage = async ({ text, roomId }: CreateMessageRequest) => {
  const gpt3Response = await openai.chat.completions.create({
    messages: [{ role: "user", content: text }],
    model: "gpt-3.5-turbo",
  });
  const roomDoc = doc(firestore, "rooms", roomId.toString());
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
    mutationFn: ({ text }: Pick<CreateMessageRequest, "text">) =>
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

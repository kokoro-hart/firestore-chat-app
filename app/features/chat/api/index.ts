import { useToast } from "@/app/components/ui";
import { queryClient } from "@/app/libs";
import { useAuth } from "@/app/providers";
import { db } from "@/firebase";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

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

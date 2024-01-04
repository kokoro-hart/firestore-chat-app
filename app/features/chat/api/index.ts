import { useAuth } from "@/app/providers";
import { db } from "@/firebase";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Timestamp, collection, getDocs, orderBy, query, where } from "firebase/firestore";

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

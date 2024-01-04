"use client";
import { User, onAuthStateChanged } from "firebase/auth";
import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";
import { getPath } from "../utils";

type AuthContextType = {
  user: User | null;
  userId: string | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  selectedRoom: string | null;
  setSelectedRoom: React.Dispatch<React.SetStateAction<string | null>>;
  selectRoomName: string | null;
  setSelectRoomName: React.Dispatch<React.SetStateAction<string | null>>;
};

const initialData = {
  user: null,
  userId: null,
  setUser: () => {},
  selectedRoom: null,
  setSelectedRoom: () => {},
  selectRoomName: null,
  setSelectRoomName: () => {},
};

const AuthContext = createContext<AuthContextType>(initialData);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [userId, setUserId] = useState<AuthContextType["userId"]>(null);
  const [selectedRoom, setSelectedRoom] = useState<AuthContextType["selectedRoom"]>(null);
  const [selectRoomName, setSelectRoomName] = useState<AuthContextType["selectRoomName"]>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setUserId(user && user.uid);

      if (!user) {
        router.push(getPath.auth.login());
      }
    });

    return () => {
      unsubscribe();
    };
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        userId,
        setUser,
        selectedRoom,
        setSelectedRoom,
        selectRoomName,
        setSelectRoomName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

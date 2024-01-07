"use client";
import { FirebaseApp } from "firebase/app";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";

import { firebaseApp } from "@/app/libs";

import { getPath } from "../utils";

type AuthState = {
  status: "idle" | "login" | "logout";
  user?: User;
  userId?: string;
};

const initialState: AuthState = {
  status: "idle",
};

const getStore = (app: FirebaseApp) => {
  let state: AuthState = initialState;

  return {
    getSnapshot: () => state,
    getServerSnapshot: () => initialState,
    subscribe: (callback: () => void) => {
      const auth = getAuth(app);
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          state = {
            status: "login",
            user: user,
            userId: user.uid,
          };
        } else {
          state = {
            status: "logout",
          };
        }
        callback();
      });

      return () => {
        unsubscribe();
      };
    },
  };
};

export const useSubscribeAuthStateChanged = () => {
  const [store] = useState(() => {
    return getStore(firebaseApp);
  });

  const state = useSyncExternalStore<AuthState>(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );

  return state;
};

const AuthContext = createContext<AuthState>(initialState);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const { user, userId, status } = useSubscribeAuthStateChanged();

  useEffect(() => {
    if (!user && status !== "idle") {
      router.push(getPath.auth.login());
    }
  }, [router, user, status]);

  return (
    <AuthContext.Provider
      value={{
        user,
        userId,
        status,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

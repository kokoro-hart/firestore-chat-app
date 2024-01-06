"use client";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import { firebaseApp } from "@/app/libs";
import { useRouter } from "next/navigation";
import { getPath } from "../utils";
import { FirebaseApp } from "firebase/app";

type AuthState = {
  status: "loading" | "login" | "logout";
  user: User | undefined;
  userId: string | undefined;
};

const initialState: AuthState = {
  status: "loading",
  user: undefined,
  userId: undefined,
};

const AuthContext = createContext<AuthState>(initialState);

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
            user: undefined,
            userId: undefined,
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

export function AuthProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const { user, userId, status } = useSubscribeAuthStateChanged();

  useEffect(() => {
    if (!user && status !== "loading") {
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
}

export function useAuth() {
  return useContext(AuthContext);
}

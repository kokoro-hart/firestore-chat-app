"use client";
import { PropsWithChildren, Suspense } from "react";

import { QueryProvider } from "./QueryProvider";
import { AuthProvider } from ".";
import { Toaster } from "../components/ui";

export const AppProvider = ({ children }: PropsWithChildren) => {
  return (
    <QueryProvider>
      <AuthProvider>
        {children}
        <Toaster />
      </AuthProvider>
    </QueryProvider>
  );
};

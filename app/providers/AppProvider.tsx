"use client";
import { PropsWithChildren } from "react";

import { Toaster } from "../components/ui";

import { QueryProvider } from "./QueryProvider";

import { AuthProvider } from ".";

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

"use client";
import { PropsWithChildren } from "react";

import { Toaster } from "../components/ui";

import { QueryProvider } from "./QueryProvider";

export const AppProvider = ({ children }: PropsWithChildren) => {
  return (
    <QueryProvider>
      {children}
      <Toaster />
    </QueryProvider>
  );
};

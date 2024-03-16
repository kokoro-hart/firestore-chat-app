"use client";
import { PropsWithChildren } from "react";

import { Rooms } from "@/app/features/chat";
import { AuthProvider } from "@/app/providers";

export default function ChatLayout({ children }: PropsWithChildren) {
  return (
    <AuthProvider>
      <div className="flex h-screen flex-col items-center justify-center">
        <div className="flex h-full w-full">
          <div
            className="h-full w-1/5 overflow-y-auto border-r border-border"
            style={{ overscrollBehavior: "none" }}
          >
            <Rooms />
          </div>
          <div className="h-full w-4/5 overflow-y-auto p-4" style={{ overscrollBehavior: "none" }}>
            {children}
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}

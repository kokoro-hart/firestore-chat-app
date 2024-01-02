"use client";
import { Chat, SideNav } from "@/app/features/chat";
export default function ChatPage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="h-full flex w-full">
        <div
          className="w-1/5 h-full border-r overflow-y-auto border-border p-4"
          style={{ overscrollBehavior: "none" }}
        >
          <SideNav />
        </div>
        <div className="w-4/5 h-full overflow-y-auto p-4" style={{ overscrollBehavior: "none" }}>
          <Chat />
        </div>
      </div>
    </div>
  );
}

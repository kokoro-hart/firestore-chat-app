"use client";
import { LoginForm } from "@/app/features/auth";
export default function LoginPage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
      <LoginForm />
    </div>
  );
}

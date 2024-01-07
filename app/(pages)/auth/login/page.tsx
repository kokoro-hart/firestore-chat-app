"use client";
import { SignInForm } from "@/app/features/auth";
export default function LoginPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-slate-50">
      <SignInForm />
    </div>
  );
}

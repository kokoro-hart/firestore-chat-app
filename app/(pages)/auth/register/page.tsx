"use client";
import { SignUpForm } from "@/app/features/auth";
export default function RegisterPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-slate-50">
      <SignUpForm />
    </div>
  );
}

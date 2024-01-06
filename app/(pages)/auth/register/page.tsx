"use client";
import { SignUpForm } from "@/app/features/auth";
export default function RegisterPage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
      <SignUpForm />
    </div>
  );
}

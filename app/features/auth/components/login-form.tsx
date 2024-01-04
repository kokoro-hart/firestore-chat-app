"use client";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";
import { Button, FieldWrapper, Form, Input, Link, useToast } from "@/app/components/ui";
import { getPath } from "@/app/utils";
import { LoginRequest, userSchema } from "../types";

export const LoginForm = () => {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (data: LoginRequest) => {
    await signInWithEmailAndPassword(auth, data.email, data.password)
      .then(() => {
        router.push(getPath.chat.root());
      })
      .catch((error) => {
        if (error.code === "auth/invalid-credential") {
          toast({
            variant: "destructive",
            title: "Such users do not exist.",
          });
        } else {
          toast({
            variant: "destructive",
            title: error.message,
          });
        }
      });
  };

  return (
    <Form<LoginRequest> id="register" onSubmit={handleSubmit} schema={userSchema}>
      {({ control }) => (
        <div className="p-8 border-border rounded-xl border bg-card text-card-foreground shadow min-w-[403px]">
          <h1 className="mb-4 text-2xl text-gray-700 text-center font-bold">Login</h1>
          <div className="flex flex-col gap-4">
            <FieldWrapper label="Email" name="email" control={control}>
              {({ field }) => <Input placeholder="example.com" {...field} />}
            </FieldWrapper>
            <FieldWrapper label="Password" name="password" control={control}>
              {({ field }) => <Input placeholder="password" {...field} />}
            </FieldWrapper>
            <div className="flex justify-center">
              <Button id="register" type="submit">
                Login
              </Button>
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <span className="text-gray-600 text-sm">Don`t have an account?</span>
            <Link href={getPath.auth.register()} className="text-blue-500 text-sm">
              Go to register page
            </Link>
          </div>
        </div>
      )}
    </Form>
  );
};

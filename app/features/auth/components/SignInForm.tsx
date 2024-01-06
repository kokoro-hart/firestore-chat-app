"use client";
import { Button, FieldWrapper, Form, Input, Link } from "@/app/components/ui";
import { getPath } from "@/app/utils";
import { SignInRequest, userSchema } from "../types";
import { useSignIn } from "../api";

export const SignInForm = () => {
  const { mutateAsync: signIn, isPending: isPendingSignIn } = useSignIn();
  return (
    <Form<SignInRequest> id="login" onSubmit={(data) => signIn(data)} schema={userSchema}>
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
              <Button id="login" type="submit" isLoading={isPendingSignIn}>
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

"use client";
import { Button, FieldWrapper, Form, Input, Link } from "@/app/components/ui";
import { getPath } from "@/app/utils";

import { useSignIn } from "../api";
import { SignInRequest, userSchema } from "../types";

export const SignInForm = () => {
  const { mutateAsync: signIn, isPending: isPendingSignIn } = useSignIn();
  return (
    <Form<SignInRequest> id="login" onSubmit={(data) => signIn(data)} schema={userSchema}>
      {({ control }) => (
        <div className="min-w-[403px] rounded-xl border border-border bg-card p-8 text-card-foreground shadow">
          <h1 className="mb-4 text-center text-2xl font-bold text-gray-700">Login</h1>
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
            <span className="text-sm text-gray-600">Don`t have an account?</span>
            <Link href={getPath.auth.register()} className="text-sm text-blue-500">
              Go to register page
            </Link>
          </div>
        </div>
      )}
    </Form>
  );
};

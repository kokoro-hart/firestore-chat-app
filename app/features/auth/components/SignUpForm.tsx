"use client";
import { Button, FieldWrapper, Form, Input, Link } from "@/app/components/ui";
import { getPath } from "@/app/utils";

import { useSignUp } from "../api";
import { SignUpRequest, userSchema } from "../types";

export const SignUpForm = () => {
  const { mutateAsync: signUp, isPending: isPendingSignUp } = useSignUp();
  return (
    <Form<SignUpRequest> id="register" onSubmit={(data) => signUp(data)} schema={userSchema}>
      {({ control }) => (
        <div className="min-w-[403px] rounded-xl border border-border bg-card p-8 text-card-foreground shadow">
          <h1 className="mb-4 text-center text-2xl font-bold text-gray-700">Create an account</h1>
          <div className="flex flex-col gap-4">
            <FieldWrapper label="Email" name="email" control={control}>
              {({ field }) => <Input placeholder="example.com" {...field} />}
            </FieldWrapper>
            <FieldWrapper label="Password" name="password" control={control}>
              {({ field }) => <Input placeholder="password" {...field} />}
            </FieldWrapper>
            <div className="flex justify-center">
              <Button id="register" type="submit" isLoading={isPendingSignUp}>
                Create account
              </Button>
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <span className="text-sm text-gray-600">Already have an account?</span>
            <Link href={getPath.auth.login()} className="text-sm text-blue-500">
              Go to login page
            </Link>
          </div>
        </div>
      )}
    </Form>
  );
};

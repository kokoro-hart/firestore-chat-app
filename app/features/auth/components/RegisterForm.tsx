"use client";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";
import { Button, FieldWrapper, Form, Input, Link, useToast } from "@/app/components/ui";
import { z } from "zod";
import { getPath } from "@/app/utils";

export const schema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(6, {
    message: "Please enter a password with at least 6 characters",
  }),
});

type RegisterRequest = z.infer<typeof schema>;

export const RegisterForm = () => {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (data: RegisterRequest) => {
    await createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((userCrendential) => {
        const user = userCrendential.user;
        router.push(getPath.auth.login());
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          toast({
            variant: "destructive",
            title: "This email address is already in use.",
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
    <Form<RegisterRequest> id="register" onSubmit={handleSubmit} schema={schema}>
      {({ control }) => (
        <div className="p-8 border-border rounded-xl border bg-card text-card-foreground shadow min-w-[403px]">
          <h1 className="mb-4 text-2xl text-gray-700 text-center font-bold">Create an account</h1>
          <div className="flex flex-col gap-4">
            <FieldWrapper label="Email" name="email" control={control}>
              {({ field }) => <Input placeholder="example.com" {...field} />}
            </FieldWrapper>
            <FieldWrapper label="Password" name="password" control={control}>
              {({ field }) => <Input placeholder="password" {...field} />}
            </FieldWrapper>
            <div className="flex justify-center">
              <Button id="register" type="submit">
                Create account
              </Button>
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <span className="text-gray-600 text-sm">Already have an account?</span>
            <Link href={getPath.auth.login()} className="text-blue-500 text-sm">
              Go to login page
            </Link>
          </div>
        </div>
      )}
    </Form>
  );
};
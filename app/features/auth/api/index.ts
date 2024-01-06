import { firebaseAuth } from "@/app/libs";
import {
  AuthError,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { SignInRequest, SignUpRequest } from "..";
import { getPath } from "@/app/utils";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/components/ui";
import { useMutation } from "@tanstack/react-query";

export const useSignIn = () => {
  const router = useRouter();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: SignInRequest) => {
      await signInWithEmailAndPassword(firebaseAuth, data.email, data.password);
    },
    onSuccess: () => {
      router.push(getPath.chat.root());
    },
    onError: (error: AuthError) => {
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
    },
  });
};

export const useSignUp = () => {
  const router = useRouter();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: SignUpRequest) => {
      await createUserWithEmailAndPassword(firebaseAuth, data.email, data.password);
    },
    onSuccess: () => {
      router.push(getPath.auth.login());
    },
    onError: (error: AuthError) => {
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
    },
  });
};

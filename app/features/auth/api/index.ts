import { firebaseAuth } from "@/app/libs";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { SignInRequest, SignUpRequest } from "..";
import { getPath } from "@/app/utils";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/components/ui";

export const useSignIn = () => {
  const router = useRouter();
  const { toast } = useToast();

  const signIn = async (data: SignInRequest) => {
    await signInWithEmailAndPassword(firebaseAuth, data.email, data.password)
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

  return {
    signIn,
  };
};

export const useSignUp = () => {
  const router = useRouter();
  const { toast } = useToast();

  const signUp = async (data: SignUpRequest) => {
    await createUserWithEmailAndPassword(firebaseAuth, data.email, data.password)
      .then(() => {
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

  return {
    signUp,
  };
};

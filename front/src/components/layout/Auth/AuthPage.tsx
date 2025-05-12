import { BigButton } from "@/components/ui/BigButton";
import { Body, Display, Tiny } from "@/components/ui/Typography";
import { LoginForm } from "@/features/auth/components/LoginForm";
import Link from "next/link";

export const AuthPage = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-full max-w-md flex flex-col gap-6">
        <div className="text-center">
          <Display>Welcome back</Display>
          <Body>
            First time ? <Link href="/register">Sign Up</Link>
          </Body>
        </div>
        <LoginForm />
        <div className="flex flex-row gap-2.5 p-2.5">
          <div className="flex h-px w-full"></div>
          <Tiny className="text-[var(--black-100)]">OR</Tiny>
          <div className="flex h-px w-full"></div>
        </div>
        <Link href="/login/socials">
          <BigButton variant="black" className="w-full">
            Social media Sign In
          </BigButton>
        </Link>
      </div>
    </div>
  );
};

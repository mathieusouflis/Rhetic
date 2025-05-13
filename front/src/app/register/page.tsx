"use client";

import { BigButton } from "@/components/ui/BigButton";
import Icon from "@/components/ui/Icons";
import { Body, Display, Tiny } from "@/components/ui/Typography";
import RegisterForm from "@/features/auth/components/RegisterForm";
import Link from "next/link";

const Login = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-full max-w-sm flex flex-col gap-6">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center w-fit aspect-square rounded-[20px] p-2.5 bg-[var(--black-700)] shadow-[var(--shadow-icon)] border border-[var(--black-500)]">
            <Icon name="logo" size={62} />
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Display>Welcome aboard</Display>
            <Body className="text-[var(--black-100)]">
              Allready have an account ?{" "}
              <Link href="/login" className="text-[var(--white)]">
                Sign In
              </Link>
            </Body>
          </div>
        </div>
        <RegisterForm />
        <div className="flex flex-row items-center gap-2.5 p-2.5">
          <div className="flex h-px w-full bg-[var(--black-500)]"></div>
          <Tiny className="text-[var(--black-100)]">OR</Tiny>
          <div className="flex h-px w-full bg-[var(--black-500)]"></div>
        </div>
        <Link href="/auth/socials">
          <BigButton variant="black" className="w-full">
            Social media Sign Up
          </BigButton>
        </Link>
      </div>
    </div>
  );
};

export default Login;

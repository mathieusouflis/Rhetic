"use client";

import { BigButton } from "@/components/ui/BigButton";
import Icon from "@/components/ui/Icons";
import { Body, Display, Tiny } from "@/components/ui/Typography";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-full max-w-sm flex flex-col gap-6">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center w-fit aspect-square rounded-[20px] p-2.5 bg-[var(--black-700)] shadow-[var(--shadow-icon)] border border-[var(--black-500)]">
            <Icon name="logo" size={62} />
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Display>Welcome !</Display>
            <Body className="text-[var(--black-100)]">
              Take a seat and enjoy the ride.
            </Body>
          </div>
        </div>
        <div className="flex flex-col gap-2 5">
          <Link href={"http://localhost:1337/api/connect/auth0"}>
            <BigButton
              variant="black"
              leftIcon
              leftIconName="github"
              rightIcon
              rightIconName="arrow_right"
              className="w-full"
            >
              Github
            </BigButton>
          </Link>
          <Link href={"http://localhost:1337/api/connect/auth0"}>
            <BigButton
              variant="black"
              leftIcon
              leftIconName="google"
              rightIcon
              rightIconName="arrow_right"
              className="w-full"
            >
              Google
            </BigButton>
          </Link>
          <Link href={"http://localhost:1337/api/connect/auth0"}>
            <BigButton
              variant="black"
              leftIcon
              leftIconName="apple"
              rightIcon
              rightIconName="arrow_right"
              className="w-full"
            >
              Apple
            </BigButton>
          </Link>
          <div className="flex flex-row items-center gap-2.5 p-2.5">
            <div className="flex h-px w-full bg-[var(--black-500)]"></div>
            <Tiny className="text-[var(--black-100)]">OR</Tiny>
            <div className="flex h-px w-full bg-[var(--black-500)]"></div>
          </div>
          <Link href="/login">
            <BigButton variant="black" className="w-full">
              Normal Sign In
            </BigButton>
          </Link>
        </div>
      </div>
    </div>
  );
}

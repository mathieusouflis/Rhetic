"use client";
import { BigButton } from "@/components/ui/BigButton";
import { TextInput } from "@/components/ui/TextInput";
import {
  BigBody,
  Body,
  Display,
  H1,
  H2,
  Small,
  Tiny,
} from "@/components/ui/Typography";
import { apiClient } from "@/lib/api/apiClient";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    apiClient.get("/api/auth/local").then((response) => {
      console.log("Response from API:", response.data);
    });
  }, []);

  return (
    <>
      <H1>FONTS</H1>
      <Display>Display</Display>
      <H1>H1</H1>
      <H2>H2</H2>
      <BigBody>BigBody</BigBody>
      <Body>Body</Body>
      <Small>Small</Small>
      <Tiny>Tiny</Tiny>
      <H1>BUTTONS</H1>
      <BigButton>Social media sign in</BigButton>
      <BigButton leftIcon>Social media sign in</BigButton>
      <BigButton rightIcon>Social media sign in</BigButton>
      <BigButton
        leftIcon
        leftIconName="github"
        rightIcon
        rightIconName="arrow_right"
      >
        Social media sign in
      </BigButton>
      <TextInput leftIcon linkText="Test" />
      <p>Coucou</p>
    </>
  );
}

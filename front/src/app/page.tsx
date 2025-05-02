"use client";
import { ActionButton } from "@/components/ui/ActionButton";
import { BigButton } from "@/components/ui/BigButton";
import { Community } from "@/components/ui/Community";
import { ImageSet, SetImage } from "@/components/ui/ImageSet";
import LittleAction from "@/components/ui/LittleAction";
import { NavButton } from "@/components/ui/NavButton";
import Notification from "@/components/ui/Notification";
import PostWriter from "@/components/ui/PostWriter";
import { SearchBar } from "@/components/ui/Searchbar";
import Shortcut from "@/components/ui/Shortcut";
import Tag from "@/components/ui/Tag";
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
import Image from "next/image";
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
      <Notification>10</Notification>
      <Notification status="active">10</Notification>
      <Notification color="white">10</Notification>
      <Notification color="white" status="active">
        10
      </Notification>
      <Shortcut>K</Shortcut>
      <Shortcut status="background">K</Shortcut>
      <NavButton command>Test</NavButton>
      <NavButton notification>Test</NavButton>
      <NavButton variant="selected">Test</NavButton>
      <NavButton variant="hover">Test</NavButton>
      <ActionButton>Test</ActionButton>
      <ActionButton variant="gray">Test</ActionButton>
      <ActionButton variant="gray2">Test</ActionButton>
      <ActionButton styleText="bold" variant="white">
        Test
      </ActionButton>
      <SearchBar />
      <SearchBar searchSize="tiny" />
      <PostWriter />
      <Tag name="king" />
      <Tag name="dev" />
      <Tag name="mod" />
      <Tag name="mod" variant="icon" />
      <LittleAction
        iconName="bookmark"
        onClick={() => {
          console.log("clicked");
        }}
      >
        10
      </LittleAction>
      <Community
        name="Mathieu"
        iconUrl="https://images.unsplash.com/photo-1726066012604-a309bd0575df?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />
    </>
  );
}

"use client";
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
      <p>Coucou</p>
    </>
  );
}

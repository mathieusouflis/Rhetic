"use client";
import { useState } from "react";
import { SearchBar } from "@/components/ui/Searchbar";
import { useRouter } from "next/navigation";

export default function Search() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <form onSubmit={handleSearch}>
      <SearchBar
        name="query"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Rechercher sur Rhetic"
      />
    </form>
  );
}

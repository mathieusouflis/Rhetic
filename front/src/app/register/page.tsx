"use client";

import { useState } from "react";
import { DropdownSelect } from "@/components/ui/Dropdown";
import { Body } from "@/components/ui/Typography";

const RegisterPage = () => {
  const [selectedOption, setSelectedOption] = useState<string>("");

  const options = [
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" },
    { label: "Option 3", value: "option3" },
    { label: "Option 4", value: "option4" },
  ];

  return (
    <div className="flex flex-col gap-4 p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Register Page</h1>
      <p className="mb-4">Welcome to the register page!</p>

      <div className="mb-4">
        <Body className="mb-2">Select an option:</Body>
        <DropdownSelect
          options={options}
          value={selectedOption}
          onChange={setSelectedOption}
          placeholder="Choose an option"
          searchable={true}
        />
      </div>

      {selectedOption && (
        <div className="mt-4 p-3 bg-[var(--black-700)] rounded-md">
          <Body>
            You selected:{" "}
            {options.find((opt) => opt.value === selectedOption)?.label}
          </Body>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;

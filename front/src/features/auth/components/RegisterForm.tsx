"use client";

import { useForm } from "@/hooks/useForm";
import { useAuth } from "@/providers/AuthProvider";
import { z } from "zod";
import { emailSchema, passwordSchema } from "@/lib/utils/validation";
import { TextInput } from "@/components/ui/TextInput";
import { BigButton } from "@/components/ui/BigButton";
import { useState } from "react";
import { Body } from "@/components/ui/Typography";

const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username must be less than 20 characters")
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    "Username can only contain letters, numbers, - and _"
  );

const registerSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const { register } = useAuth();
  //   const [isUsernameAvailable, setIsUsernameAvailable] = useState<
  //     boolean | null
  //   >(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  //   const checkUsernameMutation = useMutation({
  //     mutationFn: async (username: string) => {
  //       const response = await fetch(`/api/check-username?username=${username}`);
  //       if (!response.ok) throw new Error("Failed to check username");
  //       return response.json();
  //     },
  //   });

  //   const debouncedCheckUsername = useCallback(
  //     debounce(async (username: string) => {
  //       if (username.length < 3) return;
  //       setIsCheckingUsername(true);
  //       try {
  //         const result = await checkUsernameMutation.mutateAsync(username);
  //         setIsUsernameAvailable(result.available);
  //       } catch (error) {
  //         console.error("Username check failed:", error);
  //       } finally {
  //         setIsCheckingUsername(false);
  //       }
  //     }, 2300),
  //     []
  //   );

  const { values, errors, isSubmitting, handleChange, handleSubmit } =
    useForm<RegisterFormValues>({
      initialValues: {
        username: "",
        email: "",
        password: "",
      },
      validate: (values) => {
        const result = registerSchema.safeParse(values);
        if (!result.success) {
          const errors: Record<string, string> = {};
          Object.entries(result.error.formErrors.fieldErrors).forEach(
            ([key, value]) => {
              errors[key] = value?.[0] || "";
            }
          );
          return errors;
        }
        // if (!isUsernameAvailable) {
        //   return { username: "This username is already taken" };
        // }
        return {};
      },
      onSubmit: async (values) => {
        console.log("SUBMITING");

        try {
          await register({
            username: values.username,
            email: values.email,
            password: values.password,
          });
        } catch (error) {
          console.error("Registration error:", error);
        }
      },
    });

  //   useEffect(() => {
  //     if (values.username) {
  //       debouncedCheckUsername(values.username);
  //     }
  //   }, [values.username, debouncedCheckUsername]);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <TextInput
          name="username"
          placeholder="Username"
          value={values.username}
          onChange={handleChange}
          leftIcon
          leftIconName="at_sign"
        />
        {isCheckingUsername && (
          <Body className="text-sm text-yellow-500">
            Checking username availability...
          </Body>
        )}
        {/* {!isCheckingUsername && isUsernameAvailable === false && (
          <Body className="text-sm text-red-500">
            Username is already taken
          </Body>
        )}
        {!isCheckingUsername && isUsernameAvailable === true && (
          <Body className="text-sm text-green-500">Username is available</Body>
        )} */}
        {errors.username && (
          <Body className="text-sm text-[var(--red)]">{errors.username}</Body>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <TextInput
          name="email"
          placeholder="Email"
          type="email"
          value={values.email}
          onChange={handleChange}
        />
        {errors.email && (
          <Body className="text-sm text-[var(--red)]">{errors.email}</Body>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <TextInput
          name="password"
          type="password"
          placeholder="Password"
          value={values.password}
          onChange={handleChange}
        />
        {errors.password && (
          <Body className="text-sm text-[var(--red)]">{errors.password}</Body>
        )}
      </div>

      <BigButton
        type="submit"
        variant="white"
        disabled={isSubmitting}
        className="w-full"
      >
        <strong>
          {isSubmitting ? "Creating account..." : "Create account"}
        </strong>
      </BigButton>
    </form>
  );
}

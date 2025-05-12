"use client";

import { useForm } from "@/hooks/useForm";
import { useAuth } from "@/providers/AuthProvider";
import { z } from "zod";
import { emailSchema, passwordSchema } from "@/lib/utils/validation";
import { TextInput } from "@/components/ui/TextInput";
import { BigButton } from "@/components/ui/BigButton";
import { Body } from "@/components/ui/Typography";
import { toastUtils } from "@/lib/utils/toast";

const loginSchema = z.object({
  identifier: emailSchema,
  password: passwordSchema,
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { login } = useAuth();

  const { values, errors, isSubmitting, handleChange, handleSubmit } =
    useForm<LoginFormValues>({
      initialValues: {
        identifier: "",
        password: "",
      },
      validate: (values) => {
        const result = loginSchema.safeParse(values);
        if (!result.success) {
          const errors: Record<string, string> = {};
          Object.entries(result.error.formErrors.fieldErrors).forEach(
            ([key, value]) => {
              errors[key] = value?.[0] || "";
            }
          );
          return errors;
        }
        return {};
      },
      onSubmit: async (values) => {
        const toastId = toastUtils.loading("Connexion en cours...");
        try {
          await login({
            identifier: values.identifier,
            password: values.password,
          });
          toastUtils.success("Connexion réussie !", toastId);
        } catch (error: any) {
          console.error("Login error:", error);
          toastUtils.error(
            error?.message ||
              "Échec de la connexion. Veuillez vérifier vos identifiants.",
            toastId
          );
        }
      },
    });

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <TextInput
          name="identifier"
          placeholder="Email"
          type="email"
          value={values.identifier}
          onChange={handleChange}
        />
        {errors.identifier && (
          <Body className="text-sm text-[var(--red)]">{errors.identifier}</Body>
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
        <strong>{isSubmitting ? "Logging in..." : "Login"}</strong>
      </BigButton>
    </form>
  );
}

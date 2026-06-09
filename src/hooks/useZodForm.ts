// src/hooks/useZodForm.ts
import { useState } from "react";
import { z, ZodSchema } from "zod";

export function useZodForm<T extends Record<string, any>>(
  schema: ZodSchema<T>,
  initialValues: T
) {
  const [form, setForm]               = useState<T>(initialValues);
  const [touched, setTouched]         = useState<Partial<Record<keyof T, boolean>>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const parseResult = schema.safeParse(form);
  const zodErrors: Partial<Record<keyof T, string>> = {};
  if (!parseResult.success) {
    parseResult.error.errors.forEach((err) => {
      const key = err.path[0] as keyof T;
      if (!zodErrors[key]) zodErrors[key] = err.message;
    });
  }

  const fieldError = (key: keyof T): string | undefined =>
    (touched[key] || submitAttempted) ? zodErrors[key] : undefined;

  const set = (key: keyof T) => (val: unknown) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  const handleSubmit =
    (onSubmit: (data: T) => void) => (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitAttempted(true);
      const result = schema.safeParse(form);
      if (!result.success) return;
      onSubmit(result.data);
    };

  const reset = () => {
    setForm(initialValues);
    setTouched({});
    setSubmitAttempted(false);
  };

  return {
    form,
    set,
    fieldError,
    handleSubmit,
    reset,
    isValid: parseResult.success,
  };
}
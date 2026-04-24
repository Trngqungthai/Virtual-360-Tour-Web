"use client";

import { LoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";

export function FormSubmitButton({
  label,
  pendingLabel,
  className = "primary-button"
}: {
  label: string;
  pendingLabel: string;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      className={`${className} disabled:cursor-not-allowed disabled:opacity-70`}
      disabled={pending}
      type="submit"
    >
      {pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
      {pending ? pendingLabel : label}
    </button>
  );
}

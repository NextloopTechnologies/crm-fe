// pages/CreateUser.tsx

import FormPage from "@/components/common/Form";
import { getUserFormSections } from "@/components/forms/UserForm";
import { useState } from "react";

export default function CreateUser() {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");
  const [touched, setTouched] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    console.log("CREATE API");
  };

  return (
    <FormPage
      heading="Create User"
      sections={getUserFormSections({
        role,
        setRole,
        touched,
        isSubmitted,
      })}
      onSubmit={handleSubmit}
      isLoading={loading}
    />
  );
}
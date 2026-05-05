// pages/EditUser.tsx

import FormPage from "@/components/common/Form";
import { getUserFormSections } from "@/components/forms/UserForm";
import { useState } from "react";

export default function EditUser() {
  const [role, setRole] = useState("admin");

  return (
    <FormPage
      heading="Edit User"
      sections={getUserFormSections({
        role,
        setRole,
      })}
      onSubmit={() => console.log("UPDATE API")}
    />
  );
}
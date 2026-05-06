import { RegisterRequest } from "@/types/api.types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function useSignup() {
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false)


async function onSubmit(form : RegisterRequest) {
    setIsLoading(true);
}

return { onSubmit, isLoading }

}
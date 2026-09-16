import { useState } from "react";

export function useSignup() {

  const [isLoading, setIsLoading] = useState(false)


async function onSubmit() {
    setIsLoading(true);
}

return { onSubmit, isLoading }

}
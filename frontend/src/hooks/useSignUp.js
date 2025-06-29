import React from "react";
import { signup } from "../lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
function useSignUp() {
    const queryClient =useQueryClient();
  const {
    mutate,
    isPending,
    error,
  } = useMutation({
    mutationFn: signup,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });
  return {isPending,error,signupMutation:mutate}
}

export default useSignUp;

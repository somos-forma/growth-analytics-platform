"use client";
import { useMutation } from "@tanstack/react-query";
import { loginAuth } from "../services/auth";

export function useCreateClient() {
  return useMutation({
    mutationFn: loginAuth,
  });
}

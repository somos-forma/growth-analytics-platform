import React from "react";
import { getClients } from "../services/client";
import { useQuery } from "@tanstack/react-query";

export const useClients = () => {
  return useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
  });
};

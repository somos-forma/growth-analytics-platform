import React from "react";
import { getAssignments } from "../services/assignment";
import { useQuery } from "@tanstack/react-query";

export const useAssignments = () => {
  return useQuery({
    queryKey: ["assignments"],
    queryFn: getAssignments,
  });
};

export type Analysis = {
  id: string;
  name: string;
  description: string;
  status: "completed" | "in_progress" | "failed";
  model: string;
  completedAgo: string;
  duration: string;
};

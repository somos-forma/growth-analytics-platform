import { Skeleton } from "../ui/skeleton";

export const OverviewSkeleton = ({ items = 8 }: { items?: number }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3   gap-3">
      {Array.from({ length: items }, () => crypto.randomUUID()).map((id) => (
        <Skeleton className="w-full h-[142px]" key={id} />
      ))}
    </div>
  );
};

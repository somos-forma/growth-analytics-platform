import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "../ui/skeleton";

export const ChartSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="w-1/3 h-6" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="w-1/2 h-4" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Skeleton className="w-full h-96" />
      </CardContent>
    </Card>
  );
};

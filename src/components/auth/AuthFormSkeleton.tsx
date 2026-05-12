import { Skeleton } from "@/components/ui/skeleton";

const AuthFormSkeleton = () => {
  return (
    <div className="space-y-6 pt-8">
      {/* Title */}
      <Skeleton className="h-8 w-3/4 rounded-lg" />
      {/* Subtitle */}
      <Skeleton className="h-4 w-1/2 rounded-md" />

      {/* Input fields */}
      <div className="space-y-4 mt-2">
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>

      {/* Button */}
      <Skeleton className="h-12 w-full rounded-xl mt-2" />

      {/* Divider + toggle */}
      <div className="flex items-center gap-3 mt-4">
        <Skeleton className="h-px flex-1" />
        <Skeleton className="h-4 w-20 rounded" />
        <Skeleton className="h-px flex-1" />
      </div>
      <Skeleton className="h-10 w-full rounded-xl" />
    </div>
  );
};

export default AuthFormSkeleton;

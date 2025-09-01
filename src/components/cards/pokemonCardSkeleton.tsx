import { Card, CardContent } from "../ui/card";

export const PokemonCardSkeleton = () => {
  return (
    <Card className="relative min-w-[150px] max-w-[280px] animate-pulse bg-muted">
      <CardContent className="flex flex-col items-center space-y-2">
        <div className="text-center">
          {/* Image skeleton */}
          <div className="w-[100px] h-[100px] bg-muted-foreground/20 rounded-lg mb-2" />

          {/* Title skeleton */}
          <div className="h-6 w-20 bg-muted-foreground/20 rounded mx-auto" />
        </div>

        {/* Types skeleton */}
        <div className="flex gap-2 justify-center w-full">
          <div className="h-6 w-16 bg-muted-foreground/20 rounded-full" />
          <div className="h-6 w-14 bg-muted-foreground/20 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
};

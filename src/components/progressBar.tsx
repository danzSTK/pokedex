import { cn } from "@/lib/utils";
import * as ProgressPrimitive from "@radix-ui/react-progress";

type Props = React.ComponentProps<typeof ProgressPrimitive.Root> & {
  value: number;
  barColor?: string;
};

const ProgressBar = ({ value, className, barColor, ...props }: Props) => {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={"bg-primary h-full w-full flex-1 transition-all"}
        style={{
          transform: `translateX(-${100 - (value || 0)}%)`,
          ...(barColor && { backgroundColor: barColor }),
        }}
      />
    </ProgressPrimitive.Root>
  );
};

export default ProgressBar;

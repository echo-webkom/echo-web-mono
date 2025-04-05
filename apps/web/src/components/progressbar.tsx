import { cn } from "@/utils/cn";
import { xpToLevel } from "@/utils/xp";

type ProgressbarProps = {
  value: number;
  min: number;
  max: number;
  className?: string;
};

export const Progressbar = ({ value, min, max, className }: ProgressbarProps) => {
  const clampedValue = Math.min(Math.max(value, min), max);
  const fullProgressBar = max - min;
  const percentageOfBar = ((clampedValue - min) / fullProgressBar) * 100;

  return (
    <div>
      <div className="flex space-x-1 pb-2 text-sm">
        <p className="font-bold">Level: {xpToLevel(value)}</p>
        <p className="text-muted-foreground">
          ({value}/{max})
        </p>
      </div>
      <div
        className={cn(
          "relative mb-2 h-4 w-full overflow-hidden rounded border-2 bg-input",
          className,
        )}
      >
        <div
          className="absolute left-0 top-0 h-full rounded-r bg-gradient-to-r from-primary to-primary-hover"
          style={{ width: `${percentageOfBar}%` }}
        />
      </div>
    </div>
  );
};

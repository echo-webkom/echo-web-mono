import {cn} from "@/utils/cn";

type ContainerProps = {
  className?: string;
  children: React.ReactNode;
};

export default function Container({className, children}: ContainerProps) {
  return (
    <div className={cn("mx-auto w-full max-w-[1500px] space-y-4 px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}

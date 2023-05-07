import {cn} from "@/utils/cn";

type ContainerProps = {
  className?: string;
  children: React.ReactNode;
};

export default function Container({className, children}: ContainerProps) {
  return (
    <div
      className={cn("mx-auto flex w-full max-w-[1500px] flex-col px-4 sm:px-6 lg:px-8", className)}
    >
      {children}
    </div>
  );
}

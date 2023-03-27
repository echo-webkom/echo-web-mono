import cn from "classnames";

type ContainerProps = {
  className?: string;
  children: React.ReactNode;
};

const Container = ({className, children}: ContainerProps) => {
  return (
    <div className={cn("mx-auto flex max-w-7xl flex-col gap-3 px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
};

export default Container;

import React from "react";

type StarBorderProps<T extends React.ElementType = "button"> = React.ComponentPropsWithoutRef<T> & {
  as?: T;
  className?: string;
  children?: React.ReactNode;
  color?: string;
  speed?: React.CSSProperties["animationDuration"];
  thickness?: number;
};

const StarBorder = <T extends React.ElementType = "button">({
  as,
  className = "",
  color = "white",
  speed = "6s",
  thickness = 1,
  children,
  ...rest
}: StarBorderProps<T>) => {
  const Component = as ?? "button";

  return (
    <Component
      className={`relative inline-block overflow-hidden rounded-[20px] ${className}`}
      {...(rest as any)}
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      style={{
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        padding: `${thickness}px 0`,
      }}
    >
      <div
        className="animate-star-movement-bottom absolute bottom-[-11px] right-[-250%] z-0 h-[50%] w-[300%] rounded-full opacity-70"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      ></div>
      <div
        className="animate-star-movement-top absolute left-[-250%] top-[-10px] z-0 h-[50%] w-[300%] rounded-full opacity-70"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      ></div>
      <div className="relative z-10 rounded-[20px] border border-gray-800 bg-gradient-to-b from-black to-gray-900 px-[26px] py-[16px] text-center text-[16px] text-white">
        {children}
      </div>
    </Component>
  );
};

export default StarBorder;

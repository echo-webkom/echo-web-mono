import {cva, type VariantProps} from "class-variance-authority";

const button = cva(
  "rounded-md text-black font-bold outline-none focus:ring-2 ring-offset-2 transform active:scale-95 transition-transform shadow-md",
  {
    variants: {
      intent: {
        primary: "bg-echo-yellow hover:bg-echo-yellow/80",
        secondary: "bg-echo-blue hover:bg-echo-blue/80 text-white",
        danger: "bg-red-500 hover:bg-red-400",
        careful: "bg-yellow-500 hover:bg-yellow-400",
        good: "bg-green-500 hover:bg-green-400",
      },
      size: {
        small: ["text-sm", "py-1", "px-2"],
        medium: ["text-base", "py-2", "px-4"],
        large: ["text-lg", "py-3", "px-6"],
      },
      fullWidth: {
        true: "w-full",
        false: "w-fit",
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "medium",
      fullWidth: false,
    },
  },
);

export interface ButtonProps
  extends React.HTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {}

export const Button: React.FC<ButtonProps> = ({className, intent, size, fullWidth, ...props}) => {
  return <button className={button({className, intent, size, fullWidth})} {...props} />;
};

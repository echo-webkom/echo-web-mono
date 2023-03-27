import Link, {type LinkProps} from "next/link";
import {cva, type VariantProps} from "class-variance-authority";

const buttonVariants = cva(
  "rounded-md text-black font-bold outline-none focus:ring-2 ring-offset-2 transform active:scale-95 transition-transform",
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
      disabled: {
        true: "opacity-50 cursor-not-allowed",
        false: "opacity-100 cursor-pointer",
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "medium",
      fullWidth: false,
      disabled: false,
    },
  },
);

interface ButtonProps
  extends React.HTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = ({className, intent, size, fullWidth, disabled, ...props}: ButtonProps) => {
  return (
    <button
      className={buttonVariants({className, intent, size, fullWidth, disabled})}
      disabled={disabled ?? false}
      {...props}
    />
  );
};

interface ButtonLinkProps extends LinkProps, VariantProps<typeof buttonVariants> {
  className?: string;
  children: React.ReactNode;
}

const ButtonLink = ({className, intent, size, fullWidth, ...props}: ButtonLinkProps) => {
  return <Link className={buttonVariants({className, intent, size, fullWidth})} {...props} />;
};

export default Button;
export {ButtonLink};

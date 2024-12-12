import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
	'inline-flex items-center font-semibold justify-center rounded-xl border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background duration-300',
	{
		variants: {
			variant: {
				default: 'bg-primary border-primary-dark text-primary-foreground hover:bg-primary-hover',
				destructive:
					'bg-destructive border-destructive-dark text-destructive-foreground hover:bg-destructive/90',
				outline: 'hover:bg-accent hover:text-accent-foreground',
				secondary:
					'bg-secondary border-secondary-dark text-secondary-foreground hover:bg-secondary-hover',
				ghost: 'hover:bg-accent border-transparent hover:text-accent-foreground',
				link: 'underline-offset-4 hover:underline text-primary'
			},
			size: {
				default: 'h-10 py-2 px-4',
				sm: 'h-9 px-3',
				lg: 'h-11 px-8',
				icon: 'h-9 w-9',
				'icon-lg': 'h-12 w-12'
			},
			fullWidth: {
				true: 'w-full',
				false: 'w-auto'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	}
);

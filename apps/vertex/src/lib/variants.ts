import { cva, type VariantProps } from 'class-variance-authority';

export const headingVariants = cva('text-4xl font-semibold mb-4 leading-tight', {
	variants: {
		size: {
			xl: 'text-6xl',
			lg: 'text-5xl',
			md: 'text-4xl',
			sm: 'text-3xl',
			xs: 'text-2xl'
		}
	},
	defaultVariants: {
		size: 'md'
	}
});

export type HeadingVariants = VariantProps<typeof headingVariants>;

export const textVariants = cva('text-base font-normal leading-6 mb-1', {
	variants: {
		size: {
			xl: 'text-2xl',
			lg: 'text-lg',
			md: 'text-base',
			sm: 'text-sm',
			xs: 'text-xs'
		},
		intent: {
			default: 'text-foreground',
			secondary: 'text-secondary-dark',
			destructive: 'text-destructive-dark',
			success: 'text-success-dark',
			warning: 'text-warning-dark',
			muted: 'text-muted-foreground'
		}
	},
	defaultVariants: {
		size: 'md',
		intent: 'default'
	}
});

export type TextVariants = VariantProps<typeof textVariants>;

export const chipVariants = cva(
	'inline-block rounded-full border-2 px-3 py-1 text-xs font-semibold',
	{
		variants: {
			variant: {
				primary: 'border-primary-dark bg-primary text-primary-foreground',
				secondary: 'border-secondary-dark bg-secondary text-secondary-foreground',
				destructive: 'border-destructive-dark bg-destructive text-destructive-foreground',
				stealth: 'bg-muted text-muted-foreground'
			},
			size: {
				default: 'text-xs',
				sm: 'text-[10px] py-[1px] px-2'
			}
		},
		defaultVariants: {
			variant: 'primary',
			size: 'default'
		}
	}
);

export type ChipVariants = VariantProps<typeof chipVariants>;

export const buttonVariants = cva(
	'inline-flex items-center justify-center active:scale-[0.98] active:transition-all rounded-2xl border-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
	{
		variants: {
			variant: {
				primary:
					'bg-primary text-primary-foreground border-primary-dark hover:bg-primary-dark focus:ring-primary',
				secondary:
					'bg-secondary text-secondary-foreground border-secondary-dark hover:bg-secondary-dark focus:ring-secondary',
				danger:
					'bg-destructive text-destructive-foreground border-destructive-dark hover:bg-destructive-dark focus:ring-destructive',
				outline: 'bg-background hover:bg-accent hover:text-accent-foreground',
				link: 'text-link underline-offset-4 hover:underline'
			},
			size: {
				default: 'h-10 px-4 py-2',
				sm: 'h-9 px-3 rounded-md',
				lg: 'h-11 px-8 rounded-md'
			},
			loading: {
				true: 'opacity-60 pointer-events-none',
				false: ''
			}
		},
		defaultVariants: {
			variant: 'primary',
			size: 'default',
			loading: false
		}
	}
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;

import aspectRatio from '@tailwindcss/aspect-ratio';
import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		fontFamily: {
			primary: ['Inter', ...fontFamily.sans],
			sans: ['Inter', ...fontFamily.sans],
			mono: ['IBM Plex Mono', ...fontFamily.mono]
		},
		extend: {
			colors: {
				background: 'var(--background)',
				foreground: 'var(--foreground)',
				border: 'var(--border)',
				input: 'var(--input)',
				ring: 'var(--ring)',
				banner: 'var(--banner)',
				wave: {
					DEFAULT: 'var(--wave)',
					foreground: 'var(--wave-foreground)',
					dark: 'var(--wave-dark)'
				},
				primary: {
					DEFAULT: 'var(--primary)',
					foreground: 'var(--primary-foreground)',
					hover: 'var(--primary-hover)',
					dark: 'var(--primary-dark)'
				},
				secondary: {
					DEFAULT: 'var(--secondary)',
					foreground: 'var(--secondary-foreground)',
					hover: 'var(--secondary-hover)',
					dark: 'var(--secondary-dark)'
				},
				table: {
					foreground: 'var(--table-foreground)',
					background: {
						DEFAULT: 'var(--table-background)',
						alt: 'var(--table-background-alt)'
					},
					header: {
						foreground: 'var(--table-header-foreground)',
						background: 'var(--table-header-background)'
					}
				},
				destructive: {
					DEFAULT: 'var(--destructive)',
					foreground: 'var(--destructive-foreground)',
					hover: 'var(--destructive-hover)',
					dark: 'var(--destructive-dark)'
				},
				muted: {
					DEFAULT: 'var(--muted)',
					foreground: 'var(--muted-foreground)',
					dark: 'var(--muted-dark)'
				},
				accent: {
					DEFAULT: 'var(--accent)',
					foreground: 'var(--accent-foreground)'
				},
				success: {
					DEFAULT: 'var(--success)',
					foreground: 'var(--success-foreground)',
					hover: 'var(--success-hover)',
					dark: 'var(--success-dark)'
				},
				info: {
					DEFAULT: 'var(--info)',
					foreground: 'var(--info-foreground)',
					hover: 'var(--info-hover)',
					dark: 'var(--info-dark)'
				},
				warning: {
					DEFAULT: 'var(--warning)',
					foreground: 'var(--warning-foreground)',
					hover: 'var(--warning-hover)',
					dark: 'var(--warning-dark)'
				},
				popover: {
					DEFAULT: 'var(--popover)',
					foreground: 'var(--popover-foreground)'
				},
				card: {
					DEFAULT: 'var(--card)',
					foreground: 'var(--card-foreground)'
				},
				reaction: {
					DEFAULT: 'var(--selected)',
					foreground: 'var(--text-foreground)'
				},
				feide: {
					DEFAULT: 'var(--feide)',
					hover: 'var(--feide-hover)',
					dark: 'var(--feide-dark)'
				},
				footer: {
					DEFAULT: 'var(--footer)',
					border: 'var(--footer-border)',
					foreground: 'var(--footer-foreground)'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [typography, forms, containerQueries, aspectRatio]
} satisfies Config;

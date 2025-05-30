
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#000000', // Preto
					foreground: '#FFFFFF'
				},
				secondary: {
					DEFAULT: '#FFA500', // Laranja
					foreground: '#000000'
				},
				accent: {
					DEFAULT: '#FFD700', // Amarelo
					foreground: '#000000'
				},
				warning: {
					DEFAULT: '#FFD700', // Amarelo para alertas
					foreground: '#000000'
				},
				destructive: {
					DEFAULT: '#dc2626',
					foreground: '#FFFFFF'
				},
				muted: {
					DEFAULT: '#f5f5f5',
					foreground: '#666666'
				},
				popover: {
					DEFAULT: '#FFFFFF',
					foreground: '#000000'
				},
				card: {
					DEFAULT: '#FFFFFF',
					foreground: '#000000'
				},
				sidebar: {
					DEFAULT: '#FFFFFF', // Sidebar branca
					foreground: '#000000', // Texto preto
					primary: '#FFA500', // Laranja
					'primary-foreground': '#000000',
					accent: '#FFD700', // Amarelo
					'accent-foreground': '#000000',
					border: '#e5e5e5', // Borda cinza clara
					ring: '#FFA500'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

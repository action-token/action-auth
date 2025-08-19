/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--auth-border))",
        input: "hsl(var(--auth-input))",
        ring: "hsl(var(--auth-ring))",
        background: "hsl(var(--auth-background))",
        foreground: "hsl(var(--auth-foreground))",
        primary: {
          DEFAULT: "hsl(var(--auth-primary))",
          foreground: "hsl(var(--auth-primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--auth-secondary))",
          foreground: "hsl(var(--auth-secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--auth-destructive))",
          foreground: "hsl(var(--auth-destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--auth-muted))",
          foreground: "hsl(var(--auth-muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--auth-accent))",
          foreground: "hsl(var(--auth-accent-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--auth-radius)",
        md: "calc(var(--auth-radius) - 2px)",
        sm: "calc(var(--auth-radius) - 4px)",
      },
    },
  },
  plugins: [],
};

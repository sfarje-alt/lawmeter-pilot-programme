import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          hover: "hsl(var(--primary-hover))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Risk System
        risk: {
          high: "hsl(var(--risk-high))",
          "high-foreground": "hsl(var(--risk-high-foreground))",
          medium: "hsl(var(--risk-medium))",
          "medium-foreground": "hsl(var(--risk-medium-foreground))",
          low: "hsl(var(--risk-low))",
          "low-foreground": "hsl(var(--risk-low-foreground))",
        },
        // Alert States
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        // Political Parties
        party: {
          liberal: "hsl(var(--party-liberal))",
          labor: "hsl(var(--party-labor))",
          greens: "hsl(var(--party-greens))",
          crossbench: "hsl(var(--party-crossbench))",
          republican: "hsl(var(--party-republican))",
          democrat: "hsl(var(--party-democrat))",
        },
        // Regional Color System
        region: {
          nam: "hsl(var(--region-nam))",
          "nam-accent": "hsl(var(--region-nam-accent))",
          latam: "hsl(var(--region-latam))",
          "latam-accent": "hsl(var(--region-latam-accent))",
          eu: "hsl(var(--region-eu))",
          "eu-accent": "hsl(var(--region-eu-accent))",
          gcc: "hsl(var(--region-gcc))",
          "gcc-accent": "hsl(var(--region-gcc-accent))",
          apac: "hsl(var(--region-apac))",
          "apac-accent": "hsl(var(--region-apac-accent))",
          jp: "hsl(var(--region-jp))",
          "jp-accent": "hsl(var(--region-jp-accent))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(400%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

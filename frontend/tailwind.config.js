/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // "Midnight Aurora" — electric indigo primary on a deep-space canvas.
        brand: {
          50: "#15132e", // dark tint (chips / subtle hovers)
          100: "#1d1a40",
          500: "#7c6cff", // electric indigo — primary
          600: "#6a57f5",
          700: "#5840d8",
          900: "#0a0820", // deep surface (headers / hero / footer)
        },
        accent: "#22d3ee", // cyan
        violet: "#a78bfa",
        fuchsia: "#e879f9",
        ink: {
          900: "#05040f", // page void
          800: "#08071a",
          700: "#0d0b22",
        },
      },
      fontFamily: {
        sans: ["Cairo", "Tajawal", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 20px 50px -20px rgba(0,0,0,0.7)",
        glow: "0 0 50px -8px rgba(124,108,255,0.55)",
        "glow-cyan": "0 0 44px -8px rgba(34,211,238,0.5)",
        neon: "0 0 0 1px rgba(124,108,255,0.4), 0 0 28px -4px rgba(124,108,255,0.5)",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
        shine: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        aurora: {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "33%": { transform: "translate(6%,-8%) scale(1.12)" },
          "66%": { transform: "translate(-7%,5%) scale(0.92)" },
        },
        gridpan: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "0 56px" },
        },
        glowpulse: {
          "0%,100%": { opacity: ".45" },
          "50%": { opacity: "1" },
        },
        gradient: {
          "0%,100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        spinslow: { to: { transform: "rotate(360deg)" } },
        ticker: {
          "0%,100%": { opacity: ".4", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.4)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shine: "shine 2.5s linear infinite",
        marquee: "marquee 28s linear infinite",
        aurora: "aurora 18s ease-in-out infinite",
        "aurora-slow": "aurora 26s ease-in-out infinite",
        gridpan: "gridpan 2.6s linear infinite",
        glowpulse: "glowpulse 4s ease-in-out infinite",
        gradient: "gradient 7s ease infinite",
        spinslow: "spinslow 22s linear infinite",
        ticker: "ticker 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

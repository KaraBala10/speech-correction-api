/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Futuristic Neon Colors
        neon: {
          blue: "#00d4ff",
          purple: "#a855f7",
          green: "#00ff88",
          pink: "#ff0080",
          cyan: "#00ffff",
          orange: "#ff6b35",
        },
        // Dark Cyber Colors
        cyber: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#0f0f23",
        },
        // Legacy colors for compatibility
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        secondary: {
          50: "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7",
          600: "#9333ea",
          700: "#7c3aed",
          800: "#6b21a8",
          900: "#581c87",
        },
        accent: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
        neutral: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
      },
      animation: {
        "fade-in-up": "fadeInUp 0.6s ease-out",
        "fade-in-down": "fadeInDown 0.6s ease-out",
        "fade-in-left": "fadeInLeft 0.6s ease-out",
        "fade-in-right": "fadeInRight 0.6s ease-out",
        "scale-in": "scaleIn 0.6s ease-out",
        "slide-in-top": "slideInFromTop 0.8s ease-out",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
        "pulse-neon": "pulseNeon 2s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        holographic: "holographic 3s ease-in-out infinite",
        "grid-move": "gridMove 20s linear infinite",
        "particles-float": "particlesFloat 10s ease-in-out infinite",
        "cyber-scroll": "cyberScroll 15s linear infinite",
        "neon-flicker": "neonFlicker 3s ease-in-out infinite",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInLeft: {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        fadeInRight: {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        slideInFromTop: {
          "0%": { opacity: "0", transform: "translateY(-100%)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200px 0" },
          "100%": { backgroundPosition: "calc(200px + 100%) 0" },
        },
        pulseNeon: {
          "0%, 100%": {
            boxShadow:
              "0 0 20px rgba(0, 212, 255, 0.3), 0 0 40px rgba(0, 212, 255, 0.1)",
          },
          "50%": {
            boxShadow:
              "0 0 30px rgba(0, 212, 255, 0.5), 0 0 60px rgba(0, 212, 255, 0.2)",
          },
        },
        glow: {
          "0%": {
            boxShadow:
              "0 0 20px rgba(0, 212, 255, 0.3), 0 0 40px rgba(0, 212, 255, 0.1)",
          },
          "100%": {
            boxShadow:
              "0 0 30px rgba(0, 212, 255, 0.6), 0 0 80px rgba(0, 212, 255, 0.3)",
          },
        },
        holographic: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        gridMove: {
          "0%": { transform: "translate(0, 0)" },
          "100%": { transform: "translate(50px, 50px)" },
        },
        particlesFloat: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(180deg)" },
        },
        cyberScroll: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-100%)" },
        },
        neonFlicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      backgroundImage: {
        "gradient-cyber": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "gradient-neon": "linear-gradient(45deg, #00d4ff, #a855f7, #00ff88)",
        "gradient-hologram":
          "linear-gradient(45deg, rgba(0, 212, 255, 0.1), rgba(168, 85, 247, 0.1), rgba(0, 255, 136, 0.1))",
        "gradient-dark":
          "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)",
        "cyber-grid":
          "linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px)",
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        "neon-blue":
          "0 0 20px rgba(0, 212, 255, 0.3), 0 0 40px rgba(0, 212, 255, 0.1)",
        "neon-purple":
          "0 0 20px rgba(168, 85, 247, 0.3), 0 0 40px rgba(168, 85, 247, 0.1)",
        "neon-green":
          "0 0 20px rgba(0, 255, 136, 0.3), 0 0 40px rgba(0, 255, 136, 0.1)",
        "neon-pink":
          "0 0 20px rgba(255, 0, 128, 0.3), 0 0 40px rgba(255, 0, 128, 0.1)",
        glass:
          "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
      },
    },
  },
  plugins: [],
};

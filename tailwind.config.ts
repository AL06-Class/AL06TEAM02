import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1276B1",
        "primary-dark": "#0D5E8E",
        accent: "#DFFE17",
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
        ink: "#111827",
        muted: "#6B7280",
        line: "#E5E7EB",
        surface: "#FFFFFF",
        page: "#F8FAFC",
        "primary-soft": "#EDF7FB",
        "accent-soft": "#F7FCD8",
        "success-soft": "#ECFDF5",
        "warning-soft": "#FFFBEB",
        "danger-soft": "#FEF2F2",
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,.05)",
        hover: "0 4px 12px rgba(0,0,0,.08)",
        modal: "0 8px 30px rgba(0,0,0,.15)",
      },
      zIndex: {
        dropdown: "30",
        sticky: "40",
        drawer: "50",
        modal: "60",
        toast: "70",
      },
      fontFamily: {
        sans: ["Pretendard Variable", "Noto Sans KR", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;

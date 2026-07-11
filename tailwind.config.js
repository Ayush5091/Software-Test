/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: "#0D1117",
          surface: "#151B23",
          raised: "#1C232E",
          line: "#26303C"
        },
        signal: {
          DEFAULT: "#3D5AFE",
          dim: "#2C3FB0",
          bright: "#7C8CFF"
        },
        ember: {
          DEFAULT: "#FF6B4A",
          dim: "#CC4E30"
        },
        sage: {
          DEFAULT: "#8FBF9F",
          dim: "#5E8A6E"
        },
        ink: {
          DEFAULT: "#E8EAED",
          muted: "#8B94A3",
          faint: "#5A6472"
        }
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"]
      },
      borderRadius: {
        card: "14px"
      }
    }
  },
  plugins: []
};

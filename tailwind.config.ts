import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'base': {
          '100': '#FCDE5C',
          '200': '#FAD84E',
          '300': '#F8D240',
          '400': '#F6CC32',
          '500': '#F4C624',
          '600': '#927800',
          '700': '#7A6400',
          '800': '#625000',
          '900': '#6e5600',
        }
      }
    },
    variants: {
      extend: {
        backgroundImage: {
          "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
          "gradient-conic":
            "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};
export default config;


import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Твої поточні налаштування, якщо вони там є...
  
  webpack: (config, { dev, isServer }) => {
    // Налаштовуємо WebSocket для HMR тільки у режимі розробки
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000, // Перевіряти зміни коду кожну секунду (ідеально для Docker на Linux)
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

export default nextConfig;
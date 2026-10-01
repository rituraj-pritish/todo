import { defineConfig } from "eslint/config";
import globals from 'globals'
import js from "@eslint/js";
import react from '@eslint-react/eslint-plugin'
import stylistic from '@stylistic/eslint-plugin'

export default defineConfig([
  {
    files: ["**/*.js", "**/*.jsx"],
    plugins: {
      js,
      '@stylistic': stylistic
    },
    extends: [js.configs.recommended, react.configs.recommended],
    languageOptions: {
      globals: {
        ...globals.browser
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    rules: {
      "no-unused-vars": ["warn", {
        "destructuredArrayIgnorePattern": '^_'
      }],
      "no-undef": "error",

      '@stylistic/indent': ['warn', 2],
      '@stylistic/jsx-curly-spacing': ["warn", { "when": "never" }],
      '@stylistic/object-curly-spacing': ["warn", "always"]
    },
  },
]);

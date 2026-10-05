import { defineConfig } from "eslint/config";
import globals from 'globals'
import js from "@eslint/js";
import stylistic from '@stylistic/eslint-plugin'

export default defineConfig([
  {
    files: ["**/*.js", "**/*.jsx"],
    plugins: {
      js,
      '@stylistic': stylistic
    },
    extends: [js.configs.recommended],
    languageOptions: {
      globals: {
        ...globals.browser
      }
    },
    rules: {
      "no-unused-vars": ["warn", {
        "destructuredArrayIgnorePattern": '^_'
      }],
      "no-undef": "error",

      '@stylistic/indent': ['warn', 2],
      '@stylistic/object-curly-spacing': ["warn", "always"]
    },
  },
]);

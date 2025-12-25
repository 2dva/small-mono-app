import { defineConfig } from "eslint/config";
// import pluginImport from 'eslint-plugin-import';
import rootConfig from "../eslint.config.mjs"

export default defineConfig([
    ...rootConfig,
    {
    // plugins: {
    //     import: pluginImport,
    // },

    languageOptions: {
        ecmaVersion: 2022,
        sourceType: "module",

        parserOptions: {
            project: "./tsconfig.json",
        },
    },

    settings: {
        "import/resolver": {
            node: {
                extensions: [".js", ".ts", ".tsx"],
            },
        },
    },

    rules: {
        "no-console": "warn",

        "import/no-restricted-paths": ["error", {
            zones: [{
                target: "./src/**/!(*.integration.test.ts)",
                from: "./src/test",
                message: "Import something from test dir only inside integration tests",
            }],
        }],

        "import/order": ["error", {
            groups: ["builtin", "external", "parent", "sibling", "index"],

            pathGroups: [{
                pattern: "{.,..}/**/env\n",
                group: "builtin",
                position: "before",
            }, {
                pattern: "{.,..}/**/test/integration\n",
                group: "builtin",
                position: "before",
            }],

            alphabetize: {
                order: "asc",
                caseInsensitive: false,
                orderImportKind: "asc",
            },
        }],
    },
}]);
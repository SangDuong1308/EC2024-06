const js = require("@eslint/js");

module.exports = [
    js.configs.recommended,

    {
        files: ["**/*.js"],
        ignores: ["**/*.config.js", "./eslint.config.js"],
        rules: {
            "no-unused-vars": "warn",
            "no-undef": "warn",
            "no-dupe-args": "error"
        },
        languageOptions: {
            globals: {
                "$": true,
                "require": true,
                "process": true,
                "module": true,
                "console": true
            },
            // ecmaVersion: 2021,
            sourceType: "module"
        },
    }
];

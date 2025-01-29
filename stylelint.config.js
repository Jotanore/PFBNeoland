export default {
    extends: ["stylelint-config-standard", "stylelint-config-prettier"],
    ignoreFiles: ["src/css/output.css"],
    rules: {
        "alpha-value-notation": "number"
    }
}
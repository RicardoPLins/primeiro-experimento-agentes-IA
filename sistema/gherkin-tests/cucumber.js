import { defineConfig } from "@cucumber/cucumber";

export default defineConfig({
  require: ["steps/**/*.ts"],
  requireModule: ["ts-node/register"],
  format: ["progress-bar", "html:cucumber-report.html", "json:cucumber-report.json"],
  language: "pt",
  parallel: 2,
});

#!/usr/bin/env node
const fs = require("fs");

let input = "";
process.stdin.on("data", (c) => (input += c));
process.stdin.on("end", () => {
  let payload;
  try {
    payload = JSON.parse(input);
  } catch {
    process.exit(0);
  }

  const filePath =
    (payload.tool_response && payload.tool_response.filePath) ||
    (payload.tool_input && payload.tool_input.file_path) ||
    "";
  if (!filePath) process.exit(0);

  const norm = filePath.replace(/\\/g, "/");
  if (!/(^|\/)src\//.test(norm)) process.exit(0);

  const inTestDir = /(^|\/)src\/test\//.test(norm);
  const isTsFile = /\.(ts|tsx)$/.test(norm);
  const isModuleCss = /\.module\.css$/.test(norm);

  let content = "";
  if (isTsFile) {
    try {
      content = fs.readFileSync(filePath, "utf8");
    } catch {
      content = "";
    }
  }

  const violations = [];

  if (content && !inTestDir && /console\s*\.\s*(log|error|warn|info|debug|trace|assert|table|group|groupEnd)\s*\(/.test(content)) {
    violations.push(
      "Contains console.* — project-coding-standards §5 forbids console output in application source. Route through src/lib/logger/log.ts (currently a no-op) instead."
    );
  }

  if (content) {
    const hasLineComment = /^\s*\/\//m.test(content);
    const hasBlockComment = /^\s*\/\*/m.test(content);
    if (hasLineComment || hasBlockComment) {
      violations.push(
        "Contains a code comment — project-coding-standards §2 requires application source to be comment-free. Relocate real rationale to docs/02-architecture/code-notes.md and delete the comment."
      );
    }
  }

  if (isModuleCss && /(^|\/)src\/components\//.test(norm) && !/\/styles\//.test(norm)) {
    violations.push(
      "This .module.css is not inside a styles/ subfolder — project-coding-standards §6 requires src/components/<category>/styles/<Name>.module.css."
    );
  }

  if (/__tests__/.test(norm)) {
    violations.push(
      "Path contains __tests__ — project-coding-standards §8 requires the test folder to be src/test/, not __tests__."
    );
  }

  if (/\.test\.(ts|tsx)$/.test(norm) && content && /\b(describe|it|test)\.(only|skip)\s*\(/.test(content)) {
    violations.push(
      "Test file contains describe/it/test .only( or .skip( — testing-standards requires these removed before merge."
    );
  }

  if (violations.length) {
    process.stdout.write(
      JSON.stringify({
        decision: "block",
        reason: `Standards check on ${filePath}:\n- ` + violations.join("\n- "),
      })
    );
  }
});

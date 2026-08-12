#!/usr/bin/env node
let input = "";
process.stdin.on("data", (c) => (input += c));
process.stdin.on("end", () => {
  let payload;
  try {
    payload = JSON.parse(input);
  } catch {
    process.exit(0);
  }

  const command = (payload.tool_input && payload.tool_input.command) || "";
  if (!/\bgit\s+commit\b/.test(command)) process.exit(0);

  const match = command.match(/-m\s+("([^"]*)"|'([^']*)')/);
  if (!match) process.exit(0);

  const subject = (match[2] ?? match[3] ?? "").split("\n")[0];
  const pattern = /^(feat|fix|refactor|docs|test|chore|perf|style|build|ci)(\([\w.\-/]+\))?: .+/;

  if (!pattern.test(subject)) {
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "deny",
          permissionDecisionReason:
            `git-workflow requires Conventional Commits: "type(scope): summary" ` +
            `(feat/fix/refactor/docs/test/chore/perf/style/build/ci). Got: "${subject}"`,
        },
      })
    );
  }
});

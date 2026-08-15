// Launches the Contentful MCP server with credentials read from the project's .env file.
// Claude Code only substitutes ${VAR} in .mcp.json from the environment the host was launched
// with — never from .env — which is why the previous env-var-reference config always 401'd
// (ADR-0009). This launcher removes that dependency: it loads .env itself, maps the project's
// variable names onto the ones the server expects, and execs the server over stdio.
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SERVER_ENTRY = resolve(projectRoot, "node_modules/@contentful/mcp-server/dist/index.js");

function readDotEnv(path) {
  let raw;
  try {
    raw = readFileSync(path, "utf8");
  } catch {
    return {};
  }
  const values = {};
  for (const line of raw.split(/\r?\n/)) {
    const match = /^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/.exec(line);
    if (!match || line.trim().startsWith("#")) continue;
    values[match[1]] = match[2].trim().replace(/^(['"])(.*)\1$/, "$2");
  }
  return values;
}

const dotEnv = readDotEnv(resolve(projectRoot, ".env"));
const pick = (name) => process.env[name] ?? dotEnv[name];

const managementToken = pick("CONTENTFUL_MANAGEMENT_ACCESS_TOKEN");
const spaceId = pick("SPACE_ID") ?? pick("CONTENTFUL_SPACE_ID");
const environmentId = pick("ENVIRONMENT_ID") ?? pick("CONTENTFUL_ENVIRONMENT_ID") ?? "master";
const deliveryToken = pick("CONTENTFUL_DELIVERY_TOKEN") ?? pick("CONTENTFUL_DELIVERY_ACCESS_TOKEN");

const missing = [];
if (!managementToken) missing.push("CONTENTFUL_MANAGEMENT_ACCESS_TOKEN");
if (!spaceId) missing.push("CONTENTFUL_SPACE_ID");
if (missing.length) {
  process.stderr.write(
    `contentful-mcp: missing ${missing.join(", ")} — set them in ${resolve(projectRoot, ".env")}\n`
  );
  process.exit(1);
}

const env = {
  ...process.env,
  CONTENTFUL_MANAGEMENT_ACCESS_TOKEN: managementToken,
  SPACE_ID: spaceId,
  ENVIRONMENT_ID: environmentId,
};
if (deliveryToken) env.CONTENTFUL_DELIVERY_TOKEN = deliveryToken;

const child = spawn(process.execPath, [SERVER_ENTRY, ...process.argv.slice(2)], {
  env,
  stdio: "inherit",
});

child.on("exit", (code, signal) => process.exit(signal ? 1 : (code ?? 0)));
child.on("error", (error) => {
  process.stderr.write(`contentful-mcp: failed to start server — ${error.message}\n`);
  process.exit(1);
});

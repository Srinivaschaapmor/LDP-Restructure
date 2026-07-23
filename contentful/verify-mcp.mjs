// Verifies the Contentful MCP server starts and authenticates (stdio JSON-RPC handshake).
// Not the same as it being wired into a Claude Code session — that needs a project-root launch.
import { spawn } from "node:child_process";

const env = {
  ...process.env,
  CONTENTFUL_MANAGEMENT_ACCESS_TOKEN: process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN,
  SPACE_ID: process.env.CONTENTFUL_SPACE_ID,
  ENVIRONMENT_ID: process.env.CONTENTFUL_ENVIRONMENT_ID || "master",
};

const child = spawn(process.execPath, ["node_modules/@contentful/mcp-server/dist/index.js"], { env });
let buf = "";
const send = (m) => child.stdin.write(JSON.stringify(m) + "\n");
const done = (code) => { try { child.kill(); } catch {} process.exit(code); };
const timer = setTimeout(() => { console.error("TIMEOUT waiting for MCP server"); done(1); }, 60000);

child.stdout.on("data", (d) => {
  buf += d.toString();
  let i;
  while ((i = buf.indexOf("\n")) >= 0) {
    const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
    if (!line) continue;
    let msg; try { msg = JSON.parse(line); } catch { continue; }
    if (msg.id === 1 && msg.result) {
      console.log("serverInfo:", JSON.stringify(msg.result.serverInfo));
      send({ jsonrpc: "2.0", method: "notifications/initialized" });
      send({ jsonrpc: "2.0", id: 2, method: "tools/list", params: {} });
    } else if (msg.id === 2 && msg.result) {
      const names = (msg.result.tools || []).map((t) => t.name);
      console.log(`tools (${names.length}):`, names.slice(0, 12).join(", "), names.length > 12 ? "…" : "");
      clearTimeout(timer);
      console.log("✅ Contentful MCP server started and responded.");
      done(0);
    }
  }
});
child.stderr.on("data", (d) => { const s = d.toString(); if (/error|Error|EAI|denied/.test(s)) console.error("stderr:", s.slice(0, 300)); });
child.on("error", (e) => { console.error("spawn error:", e.message); done(1); });

send({ jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "verify", version: "1.0" } } });

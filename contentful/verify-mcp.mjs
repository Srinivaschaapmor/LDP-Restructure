// Verifies the Contentful MCP server starts and authenticates (stdio JSON-RPC handshake).
// Runs it through contentful/mcp-launch.mjs — the same entry point .mcp.json uses — so the
// credentials come from .env exactly as they will inside Claude Code.
// Not the same as it being wired into a session: that also needs a project-root launch.
import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const launcher = resolve(dirname(fileURLToPath(import.meta.url)), "mcp-launch.mjs");

const child = spawn(process.execPath, [launcher], { env: process.env });
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
      send({ jsonrpc: "2.0", id: 3, method: "tools/call", params: { name: "get_initial_context", arguments: {} } });
    } else if (msg.id === 3) {
      clearTimeout(timer);
      if (msg.error) {
        console.error("get_initial_context failed:", JSON.stringify(msg.error).slice(0, 400));
        done(1);
      }
      const text = (msg.result?.content || []).map((c) => c.text || "").join(" ");
      const spaceLine = text.split("\n").find((l) => /space/i.test(l)) || text.slice(0, 200);
      console.log("get_initial_context:", spaceLine.trim().slice(0, 200));
      console.log(msg.result?.isError ? "❌ Server responded with an error." : "✅ Contentful MCP server started and authenticated.");
      done(msg.result?.isError ? 1 : 0);
    }
  }
});
child.stderr.on("data", (d) => { const s = d.toString(); if (/error|Error|EAI|denied/.test(s)) console.error("stderr:", s.slice(0, 300)); });
child.on("error", (e) => { console.error("spawn error:", e.message); done(1); });

send({ jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "verify", version: "1.0" } } });

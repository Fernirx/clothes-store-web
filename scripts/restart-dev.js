const { execSync, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

function run(command, options = {}) {
  return execSync(command, {
    stdio: options.stdio || "pipe",
    encoding: "utf8",
  });
}

function killPort3000() {
  try {
    const output = run("netstat -ano -p tcp");
    const lines = output.split(/\r?\n/);
    const pids = new Set();

    for (const line of lines) {
      // Typical LISTENING line:
      // TCP    0.0.0.0:3000   0.0.0.0:0   LISTENING   12345
      if (line.includes(":3000") && line.includes("LISTENING")) {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (/^\d+$/.test(pid)) {
          pids.add(pid);
        }
      }
    }
  } catch (error) {
    console.error("Error checking port 3000:", error);
    return;
  }
}
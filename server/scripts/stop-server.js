import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCK_FILE = path.resolve(__dirname, '../.server.lock');
const PORT = Number(process.env.PORT) || 5000;

const getListeningPids = (port) => {
  const pids = new Set();

  try {
    if (process.platform === 'win32') {
      const output = execSync(
        `netstat -ano | findstr ":${port}" | findstr "LISTENING"`,
        { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] },
      );

      for (const line of output.split('\n')) {
        const match = line.trim().match(/LISTENING\s+(\d+)\s*$/);
        if (match) {
          pids.add(Number(match[1]));
        }
      }
    } else {
      const output = execSync(`lsof -ti :${port} -sTCP:LISTEN`, {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'ignore'],
      });

      output
        .split('\n')
        .map((value) => Number(value.trim()))
        .filter(Number.isFinite)
        .forEach((pid) => pids.add(pid));
    }
  } catch {
    // Nothing listening on this port.
  }

  return [...pids];
};

const killPid = (pid) => {
  if (!pid || pid === process.pid) {
    return false;
  }

  try {
    if (process.platform === 'win32') {
      execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
    } else {
      process.kill(pid, 'SIGTERM');
    }

    return true;
  } catch {
    return false;
  }
};

const lockPid = fs.existsSync(LOCK_FILE)
  ? Number(fs.readFileSync(LOCK_FILE, 'utf8').trim())
  : null;
const portPids = getListeningPids(PORT);
const targets = [...new Set([...portPids, ...(Number.isFinite(lockPid) ? [lockPid] : [])])];

if (targets.length === 0) {
  if (fs.existsSync(LOCK_FILE)) {
    fs.unlinkSync(LOCK_FILE);
  }

  console.log(`No server running on port ${PORT}.`);
  process.exit(0);
}

let stopped = 0;

for (const pid of targets) {
  if (killPid(pid)) {
    console.log(`Stopped process ${pid}.`);
    stopped += 1;
  }
}

if (fs.existsSync(LOCK_FILE)) {
  fs.unlinkSync(LOCK_FILE);
}

if (stopped === 0) {
  console.log(`Could not stop the server on port ${PORT}. Try running as administrator.`);
  process.exit(1);
}

console.log(`Port ${PORT} is free. Run "npm run start" to start the server.`);

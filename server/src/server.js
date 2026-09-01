import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import app from './app.js';
import config from './config/index.js';
import { connectDatabase } from './config/database.js';
import { ensureDefaultAdmin } from './services/adminAuthService.js';
import { ensureDefaultCategories } from './services/categoryService.js';
import { validateTotpEncryptionConfig } from './utils/totpCrypto.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCK_FILE = path.resolve(__dirname, '../.server.lock');

let httpServer = null;

const isProcessRunning = (pid) => {
  if (!pid || Number.isNaN(pid)) {
    return false;
  }

  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
};

const readLockPid = () => {
  if (!fs.existsSync(LOCK_FILE)) {
    return null;
  }

  const pid = Number(fs.readFileSync(LOCK_FILE, 'utf8').trim());
  return Number.isFinite(pid) ? pid : null;
};

const acquireLock = () => {
  const existingPid = readLockPid();

  if (existingPid && existingPid !== process.pid && isProcessRunning(existingPid)) {
    console.error(
      `HANS Solar server is already running (PID ${existingPid}) on port ${config.port}.`,
    );
    console.error('Stop it with: npm run stop');
    console.error('Or restart with: npm run restart');
    process.exit(1);
  }

  if (existingPid && !isProcessRunning(existingPid)) {
    fs.unlinkSync(LOCK_FILE);
  }

  fs.writeFileSync(LOCK_FILE, String(process.pid));
};

const releaseLock = () => {
  const lockPid = readLockPid();

  if (lockPid === process.pid && fs.existsSync(LOCK_FILE)) {
    fs.unlinkSync(LOCK_FILE);
  }
};

const shutdown = (signal) => {
  if (httpServer) {
    httpServer.close(() => {
      releaseLock();
      process.exit(0);
    });
    return;
  }

  releaseLock();

  if (signal) {
    process.exit(0);
  }
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('exit', releaseLock);

const startServer = async () => {
  if (httpServer) {
    return;
  }

  try {
    acquireLock();
    validateTotpEncryptionConfig();
    await connectDatabase();
    await ensureDefaultAdmin();
    await ensureDefaultCategories();

    httpServer = app.listen(config.port);

    httpServer.on('listening', () => {
      console.log(
        `Server running in ${config.env} mode on port ${config.port}`,
      );
    });

    httpServer.on('error', (error) => {
      releaseLock();

      if (error.code === 'EADDRINUSE') {
        const lockPid = readLockPid();
        console.error(
          lockPid && lockPid !== process.pid
            ? `Port ${config.port} is already in use by PID ${lockPid}.`
            : `Port ${config.port} is already in use.`,
        );
        console.error('Stop it with: npm run stop');
        console.error('Or restart with: npm run restart');
      } else {
        console.error('Failed to start server:', error.message);
      }

      process.exit(1);
    });
  } catch (error) {
    releaseLock();
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

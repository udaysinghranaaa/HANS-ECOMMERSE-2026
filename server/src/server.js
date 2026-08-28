import app from './app.js';
import config from './config/index.js';
import { connectDatabase } from './config/database.js';
import { ensureDefaultAdmin } from './services/adminAuthService.js';
import { ensureDefaultCategories } from './services/categoryService.js';

const startServer = async () => {
  try {
    await connectDatabase();
    await ensureDefaultAdmin();
    await ensureDefaultCategories();

    const server = app.listen(config.port);

    server.on('listening', () => {
      console.log(
        `Server running in ${config.env} mode on port ${config.port}`,
      );
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(
          `Port ${config.port} is already in use. Stop the other process or change PORT in .env.`,
        );
      } else {
        console.error('Failed to start server:', error.message);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

import app from './app.js';
import config from './config/index.js';
import { connectDatabase } from './config/database.js';

const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(config.port, () => {
      console.log(
        `Server running in ${config.env} mode on port ${config.port}`,
      );
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

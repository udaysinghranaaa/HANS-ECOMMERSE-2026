import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './config/index.js';
import rateLimiter from './middleware/rateLimiter.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';
import uploadErrorHandler from './middleware/uploadErrorHandler.js';
import routes from './routes/index.js';
import { uploadsRoot } from './utils/fileUpload.js';

const app = express();

app.set('trust proxy', 1);

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server/no-origin requests and comma-separated CLIENT_URL origins.
      if (!origin || config.clientUrls.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(null, false);
    },
    credentials: true,
  }),
);
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
);
app.use(morgan(config.env === 'development' ? 'dev' : 'combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(rateLimiter);

app.use(
  '/uploads',
  express.static(uploadsRoot, {
    maxAge: config.env === 'production' ? '7d' : 0,
    setHeaders: (res) => {
      if (config.env !== 'production') {
        res.setHeader('Cache-Control', 'no-store');
      }
    },
  }),
);

app.get('/', (_req, res) => {
  res.type('html').send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>HANS Solar Server</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { height: 100%; }
    body {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: #ffffff;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: #171717;
    }
    h1 {
      font-size: clamp(1.5rem, 4vw, 2.25rem);
      font-weight: 600;
      text-align: center;
      padding: 1rem;
    }
  </style>
</head>
<body>
  <h1>HANS Solar Server is Running 🚀</h1>
</body>
</html>`);
});

app.use('/api/v1', routes);

app.use(uploadErrorHandler);
app.use(notFound);
app.use(errorHandler);

export default app;

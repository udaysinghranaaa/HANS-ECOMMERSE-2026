import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from '@/store/store';
import { config } from '@/config';
import App from '@/App';
import './index.css';

if (config.serverUrl) {
  fetch(`${config.serverUrl}/health`, { cache: 'no-store' }).catch(() => {});
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);

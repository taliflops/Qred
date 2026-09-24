import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ApiProvider } from './api/ApiContext';
import { App } from './App';
import './styles.css';

// No auth yet: the user comes from env, defaulting to the seeded demo user.
const userId = import.meta.env.VITE_USER_ID ?? '00000000-0000-0000-0000-000000000001';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApiProvider userId={userId}>
      <App />
    </ApiProvider>
  </StrictMode>,
);

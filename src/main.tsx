
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { NFTProvider } from './contexts/NFTContext';

const root = createRoot(document.getElementById('root')!);

root.render(
  <NFTProvider>
    <App />
  </NFTProvider>
);

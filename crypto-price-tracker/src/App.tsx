import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './store/ThemeContext';
import { WebSockerProvider } from './store/WebSocketContext';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';

export default function App() {
  return (
    <ThemeProvider>
      <WebSockerProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ProductListPage />} />
            <Route path="/:symbol" element={<ProductDetailPage />} />
          </Routes>
        </BrowserRouter>
      </WebSockerProvider>
    </ThemeProvider>
  );
}

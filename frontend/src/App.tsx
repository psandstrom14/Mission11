/**
 * App shell: global Header + React Router routes.
 * CartProvider lives in main.tsx so cart state is shared between / (BooksPage) and /cart (CartPage).
 */
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import BooksPage from './pages/BooksPage';
import CartPage from './pages/CartPage';
import AdminProjectsPage from './pages/AdminProjectsPage';

export default function App() {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<BooksPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/admin/projects" element={<AdminProjectsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
}

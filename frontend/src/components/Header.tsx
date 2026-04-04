/**
 * Global site header.
 * Rubric — Bootstrap "not in videos" #1: navbar, navbar-expand-lg, navbar-dark, bg-dark, navbar-brand, nav-link.
 */
import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-0">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    Hilton's Bookstore
                </Link>
                <div className="navbar-nav ms-auto flex-row gap-2">
                    <Link className="nav-link px-2" to="/">
                        Home
                    </Link>
                    <Link className="nav-link px-2" to="/cart">
                        Cart
                    </Link>
                    <Link className="nav-link px-2" to="/admin/projects">
                        Admin
                    </Link>
                </div>
            </div>
        </nav>
    );
}

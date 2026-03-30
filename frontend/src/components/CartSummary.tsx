/**
 * Shown on the book list (home) page only.
 * Rubric: must show both total quantity (sum of line quantities) and total price — both via .reduce().
 */
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartSummary() {
    const { cart } = useCart();
    const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0);
    const total = cart.reduce((sum, i) => sum + i.quantity * i.price, 0);

    return (
        <Link to="/cart" className="btn btn-outline-secondary btn-sm">
            {`Cart (${itemCount} ${
                itemCount === 1 ? 'item' : 'items'
            }) — $${total.toFixed(2)}`}
        </Link>
    );
}

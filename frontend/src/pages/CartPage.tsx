/**
 * Full cart view (Mission 12).
 * - Each row: unit price, quantity, subtotal (quantity × price).
 * - Footer: grand total (same formula as CartSummary).
 * - "Continue Shopping": navigate(-1) returns to previous history entry (e.g. book list with filters), per spec/video.
 */
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartPage() {
    const { cart } = useCart();
    const navigate = useNavigate();
    const grandTotal = cart.reduce((sum, i) => sum + i.quantity * i.price, 0);

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Shopping Cart</h2>

            {cart.length === 0 ? (
                <p className="text-muted">Your cart is empty.</p>
            ) : (
                <table className="table table-striped table-bordered mb-4">
                    <thead className="table-dark">
                        <tr>
                            <th>Title</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.map((item) => (
                            <tr key={item.bookId}>
                                <td>{item.title}</td>
                                <td>${item.price.toFixed(2)}</td>
                                <td>{item.quantity}</td>
                                <td>${(item.quantity * item.price).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={3} className="text-end fw-bold">
                                Total
                            </td>
                            <td className="fw-bold">${grandTotal.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
            )}

            <button
                type="button"
                className="btn btn-primary"
                onClick={() => navigate(-1)}
            >
                Continue Shopping
            </button>
        </div>
    );
}

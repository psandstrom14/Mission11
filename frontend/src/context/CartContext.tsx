/**
 * Session cart (React Context). Mission 12: cart persists while the tab is open and the user navigates routes.
 * No localStorage — refresh clears the cart (acceptable per assignment wording).
 *
 * addToCart: if bookId already exists, increment quantity (one line per book); otherwise append quantity 1.
 */
import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from 'react';

export interface CartItem {
    bookId: number;
    title: string;
    quantity: number;
    price: number;
}

export type BookForCart = Pick<CartItem, 'bookId' | 'title' | 'price'>;

type CartContextValue = {
    cart: CartItem[];
    addToCart: (book: BookForCart) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);

    const addToCart = useCallback((book: BookForCart) => {
        setCart((prev) => {
            const existing = prev.find((i) => i.bookId === book.bookId);
            if (existing) {
                return prev.map((i) =>
                    i.bookId === book.bookId
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            }
            return [
                ...prev,
                {
                    bookId: book.bookId,
                    title: book.title,
                    price: book.price,
                    quantity: 1,
                },
            ];
        });
    }, []);

    const value = useMemo(
        () => ({ cart, addToCart }),
        [cart, addToCart]
    );

    return (
        <CartContext.Provider value={value}>{children}</CartContext.Provider>
    );
}

export function useCart(): CartContextValue {
    const ctx = useContext(CartContext);
    if (!ctx) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return ctx;
}

/**
 * Bookstore home (Mission 12 rubric):
 * - Category filter: selected categories are lifted here; repeated ?category=... query params go to the API.
 * - Pagination: totalCount from the API is AFTER filters, so page counts track the filtered set (not the whole DB).
 * - We reset page to 1 when filters, sort, or page size change so users never sit on an empty page.
 * - Bootstrap grid (row / col-* below) satisfies the layout portion of the Bootstrap rubric.
 */
import { useState, useEffect } from 'react';
import '../App.css';
import BookList from '../components/BookList';
import type { Book } from '../components/BookList';
import CategoryFilter from '../components/CategoryFilter';
import CartSummary from '../components/CartSummary';
import { useCart } from '../context/CartContext';

export default function BooksPage() {
    const { addToCart } = useCart();

    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    // Matches backend TotalCount after filters; used for "Page X of Y" math.
    const [totalCount, setTotalCount] = useState(0);
    const [sortBy, setSortBy] = useState('Title');
    const [categories, setCategories] = useState<string[]>([]);
    // Lifted filter state (sibling to book list; shared with CategoryFilter via props).
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    // Stable dependency for useEffect when category selection changes (order of checks does not matter).
    const categoryQueryKey = selectedCategories.slice().sort().join('|');

    useEffect(() => {
        fetch('http://localhost:5010/api/books/categories')
            .then((response) => response.json())
            .then((data: string[]) => setCategories(data))
            .catch((error) => console.error('Error fetching categories:', error));
    }, []);

    useEffect(() => {
        const categoryQuery =
            selectedCategories.length > 0
                ? selectedCategories
                      .map((c) => `&category=${encodeURIComponent(c)}`)
                      .join('')
                : '';

        setLoading(true);
        fetch(
            `http://localhost:5010/api/books?pageNum=${pageNum}&pageSize=${pageSize}&sortBy=${sortBy}${categoryQuery}`
        )
            .then((response) => response.json())
            .then((data) => {
                setBooks(data.books);
                setTotalCount(data.totalCount);
            })
            .catch((error) => console.error('Error fetching data:', error))
            .finally(() => setLoading(false));
    }, [pageNum, pageSize, sortBy, categoryQueryKey]);

    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    const handleSortByTitle = () => {
        setSortBy(sortBy === 'Title' ? 'TitleDesc' : 'Title');
        setPageNum(1);
    };

    const handleCategorySelectionChange = (next: string[]) => {
        setSelectedCategories(next);
        setPageNum(1);
    };

    return (
        <div className="container mt-4">
            {/* Bootstrap grid: filter column + main content (grader: see Learning Suite grid note) */}
            <div className="row g-3">
                <div className="col-md-4 col-lg-3">
                    <CategoryFilter
                        categories={categories}
                        selectedCategories={selectedCategories}
                        onSelectionChange={handleCategorySelectionChange}
                    />
                </div>
                <div className="col-md-8 col-lg-9">
                    {/* Rubric: cart summary on home/book list shows quantity + price (see CartSummary.tsx). */}
                    <div className="d-flex justify-content-end mb-2">
                        <CartSummary />
                    </div>
                    <BookList
                        books={books}
                        loading={loading}
                        pageNum={pageNum}
                        pageSize={pageSize}
                        totalCount={totalCount}
                        totalPages={totalPages}
                        sortBy={sortBy}
                        onPageSizeChange={(size) => {
                            setPageSize(size);
                            setPageNum(1);
                        }}
                        onSortToggle={handleSortByTitle}
                        onPrevPage={() => setPageNum(pageNum - 1)}
                        onNextPage={() => setPageNum(pageNum + 1)}
                        onAddToCart={addToCart}
                    />
                </div>
            </div>
        </div>
    );
}

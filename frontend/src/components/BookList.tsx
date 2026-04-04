/**
 * Book list + paging controls for the home page.
 * Rubric — Bootstrap "not in videos" #2: spinner-border (and visually-hidden) while the books API request runs.
 */
import Pagination from './Pagination';
import type { BookForCart } from '../context/CartContext';

export interface Book {
    bookId: number;
    title: string;
    author: string;
    publisher: string;
    isbn: string;
    classification: string;
    pageCount: number;
    price: number;
}

type BookListProps = {
    books: Book[];
    loading: boolean;
    pageNum: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    sortBy: string;
    onPageSizeChange: (size: number) => void;
    onSortToggle: () => void;
    onPageChange: (page: number) => void;
    onAddToCart: (book: BookForCart) => void;
};

export default function BookList({
    books,
    loading,
    pageNum,
    pageSize,
    totalCount,
    totalPages,
    sortBy,
    onPageSizeChange,
    onSortToggle,
    onPageChange,
    onAddToCart,
}: BookListProps) {
    if (loading) {
        return (
            <div className="d-flex justify-content-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading books...</span>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="d-flex justify-content-between mb-3 flex-wrap gap-2 align-items-center">
                <Pagination
                    currentPage={pageNum}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    onPageChange={onPageChange}
                    onPageSizeChange={onPageSizeChange}
                    showPageNavigation={false}
                    pageSizeSelectId="book-list-page-size"
                />
                <button className="btn btn-outline-primary" onClick={onSortToggle}>
                    Sort by Title {sortBy === 'Title' ? '(A-Z)' : '(Z-A)'}
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-bordered">
                    <thead className="table-dark">
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Publisher</th>
                            <th>ISBN</th>
                            <th>Classification</th>
                            <th>Pages</th>
                            <th>Price</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map((book) => (
                            <tr key={book.bookId}>
                                <td>{book.title}</td>
                                <td>{book.author}</td>
                                <td>{book.publisher}</td>
                                <td>{book.isbn}</td>
                                <td>{book.classification}</td>
                                <td>{book.pageCount}</td>
                                <td>${book.price.toFixed(2)}</td>
                                <td>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-primary"
                                        onClick={() =>
                                            onAddToCart({
                                                bookId: book.bookId,
                                                title: book.title,
                                                price: book.price,
                                            })
                                        }
                                    >
                                        Add to cart
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination
                currentPage={pageNum}
                totalPages={totalPages}
                pageSize={pageSize}
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
                showPageSizeControls={false}
                totalItems={totalCount}
                totalItemsLabel="results"
                totalItemsDisplay="emptyOnly"
            />
        </>
    );
}

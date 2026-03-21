import { useState, useEffect } from 'react';
import './App.css'; // Keep standard Vite styling if you want, or delete this line

// Define the shape of our Book object
interface Book {
    bookId: number;
    title: string;
    author: string;
    publisher: string;
    isbn: string;
    classification: string;
    pageCount: number;
    price: number;
}

export default function App() {
    // State variables
    const [books, setBooks] = useState<Book[]>([]);
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalCount, setTotalCount] = useState(0);
    const [sortBy, setSortBy] = useState('Title');

    // Fetch data whenever pageNum, pageSize, or sortBy changes
    useEffect(() => {
        fetch(`http://localhost:5010/api/books?pageNum=${pageNum}&pageSize=${pageSize}&sortBy=${sortBy}`)
            .then(response => response.json())
            .then(data => {
                setBooks(data.books);
                setTotalCount(data.totalCount);
            })
            .catch(error => console.error("Error fetching data:", error));
    }, [pageNum, pageSize, sortBy]);

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / pageSize);

    // Toggle sorting between Title A-Z and Z-A
    const handleSortByTitle = () => {
        setSortBy(sortBy === 'Title' ? 'TitleDesc' : 'Title');
        setPageNum(1); // Reset to page 1 when sorting changes
    };

    return (
        <div className="container mt-4">
            <h2>Hilton's Bookstore</h2>
            
            <div className="d-flex justify-content-between mb-3">
                {/* Page Size Dropdown */}
                <div>
                    <label className="me-2">Results per page: </label>
                    <select 
                        value={pageSize} 
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setPageNum(1); 
                        }}
                        className="form-select d-inline-block w-auto"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                    </select>
                </div>
                
                {/* Sort Button */}
                <button className="btn btn-outline-primary" onClick={handleSortByTitle}>
                    Sort by Title {sortBy === 'Title' ? '(A-Z)' : '(Z-A)'}
                </button>
            </div>

            {/* The Data Table */}
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
                    </tr>
                </thead>
                <tbody>
                    {books.map(book => (
                        <tr key={book.bookId}>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.publisher}</td>
                            <td>{book.isbn}</td>
                            <td>{book.classification}</td>
                            <td>{book.pageCount}</td>
                            <td>${book.price.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="d-flex justify-content-between align-items-center">
                <button 
                    className="btn btn-secondary" 
                    onClick={() => setPageNum(pageNum - 1)} 
                    disabled={pageNum === 1}
                >
                    Previous
                </button>
                
                <span>Page {pageNum} of {totalPages}</span>
                
                <button 
                    className="btn btn-secondary" 
                    onClick={() => setPageNum(pageNum + 1)} 
                    disabled={pageNum >= totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
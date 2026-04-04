export type PaginationProps = {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
    /** When false, only the page-size row is rendered (e.g. BookList: pair with sort, then table, then nav-only). */
    showPageNavigation?: boolean;
    /** When false, only Previous / page label / Next is rendered. */
    showPageSizeControls?: boolean;
    /** Optional `id` for the page-size `<select>` (a11y). */
    pageSizeSelectId?: string;
    /** When set, used for the page indicator suffix and Next-button disable logic. */
    totalItems?: number;
    /** Noun after the count when totalItems > 0 (e.g. "total" → "(47 total)"). */
    totalItemsLabel?: string;
    /** Noun when totalItems === 0 (defaults to totalItemsLabel). */
    totalItemsEmptyLabel?: string;
    /** `full`: always show "(N label)"; `emptyOnly`: only when totalItems === 0 (book list style). */
    totalItemsDisplay?: 'full' | 'emptyOnly';
};

export default function Pagination({
    currentPage,
    totalPages,
    pageSize,
    onPageChange,
    onPageSizeChange,
    showPageNavigation = true,
    showPageSizeControls = true,
    pageSizeSelectId = 'pagination-page-size',
    totalItems,
    totalItemsLabel = 'items',
    totalItemsEmptyLabel,
    totalItemsDisplay = 'full',
}: PaginationProps) {
    const pageSizeRow = showPageSizeControls && (
        <div className="d-flex align-items-center gap-2 mb-3">
            <label htmlFor={pageSizeSelectId} className="mb-0">
                Items per page:
            </label>
            <select
                id={pageSizeSelectId}
                className="form-select w-auto"
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
            >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
            </select>
        </div>
    );

    const zeroLabel = totalItemsEmptyLabel ?? totalItemsLabel;
    const summaryMiddle =
        totalItems !== undefined
            ? totalItems === 0
                ? ` (0 ${zeroLabel})`
                : totalItemsDisplay === 'full'
                  ? ` (${totalItems} ${totalItemsLabel})`
                  : ''
            : '';

    const navRow = showPageNavigation && (
        <div className="d-flex justify-content-between align-items-center">
            <button
                type="button"
                className="btn btn-secondary"
                disabled={currentPage <= 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                Previous
            </button>
            <span>
                Page {currentPage} of {totalPages}
                {summaryMiddle}
            </span>
            <button
                type="button"
                className="btn btn-secondary"
                disabled={currentPage >= totalPages || (totalItems !== undefined && totalItems === 0)}
                onClick={() => onPageChange(currentPage + 1)}
            >
                Next
            </button>
        </div>
    );

    return (
        <>
            {pageSizeRow}
            {navRow}
        </>
    );
}

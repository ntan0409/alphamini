interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
    return (
        <div className="flex justify-center items-center space-x-3 mt-8">
            <button
                onClick={() => onPageChange(Math.max(1, page - 1))}
                disabled={page === 1}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${page === 1
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                    }`}
            >
                ← Trước
            </button>

            <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200">
                <span className="font-bold text-slate-700 text-sm">
                    Trang <span className="text-blue-600">{page}</span> / {totalPages}
                </span>
            </div>

            <button
                onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                disabled={page === totalPages || totalPages === 0}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${page === totalPages || totalPages === 0
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                    }`}
            >
                Sau →
            </button>
        </div>
    );
}
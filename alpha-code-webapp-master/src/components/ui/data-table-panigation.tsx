import { Table } from "@tanstack/react-table"
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react"
import { Button } from "./button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"


interface DataTablePaginationProps<TData> {
    table: Table<TData>
    size: number
    onSizeChange?: (newSize: number) => void
    onPageChange?: (page: number) => void
    total?: number
}

export function DataTablePagination<TData>({
    table,
    size,
    onSizeChange,
    onPageChange,
    total
}: DataTablePaginationProps<TData>) {
    // Đã loại bỏ i18n, chỉ dùng tiếng Việt
    const isServerSidePagination = onPageChange && total !== undefined
    
    // For server-side pagination, use provided total and current page
    const currentPage = table.getState().pagination.pageIndex + 1
    const totalRows = isServerSidePagination ? total : table.getFilteredRowModel().rows.length
    const selectedRows = table.getFilteredSelectedRowModel().rows.length
    
    // Calculate page count for server-side pagination
    const pageCount = isServerSidePagination 
        ? Math.ceil(total / size)
        : table.getPageCount()
    
    return (
        <div className="flex items-center justify-between px-2">
            <div className="text-muted-foreground flex-1 text-sm">
                {`${selectedRows} trên tổng ${totalRows} dòng đã chọn`}
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Số dòng/trang</p>
                    <Select
                        value={`${size}`}
                        onValueChange={(value) => {
                            const newSize = Number(value)
                            table.setPageSize(newSize)
                            onSizeChange?.(newSize)
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={size} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[10, 20, 25, 30, 40, 50].map((pageSize) => (
                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="hidden size-8 lg:flex"
                        onClick={() => {
                            if (isServerSidePagination) {
                                onPageChange?.(1)
                            } else {
                                table.setPageIndex(0)
                            }
                        }}
                        disabled={currentPage <= 1}
                    >
                        <span className="sr-only">Trang đầu</span>
                        <ChevronsLeft />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="size-8"
                        onClick={() => {
                            if (isServerSidePagination) {
                                onPageChange?.(currentPage - 1)
                            } else {
                                table.previousPage()
                            }
                        }}
                        disabled={currentPage <= 1}
                    >
                        <span className="sr-only">Trang trước</span>
                        <ChevronLeft />
                    </Button>
                    <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                        {`Trang ${currentPage} trên tổng ${pageCount}`}
                    </div>
                    <Button
                        variant="outline"
                        size="icon"
                        className="size-8"
                        onClick={() => {
                            if (isServerSidePagination) {
                                onPageChange?.(currentPage + 1)
                            } else {
                                table.nextPage()
                            }
                        }}
                        disabled={currentPage >= pageCount}
                    >
                        <span className="sr-only">Trang sau</span>
                        <ChevronRight />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="hidden size-8 lg:flex"
                        onClick={() => {
                            if (isServerSidePagination) {
                                onPageChange?.(pageCount)
                            } else {
                                table.setPageIndex(table.getPageCount() - 1)
                            }
                        }}
                        disabled={currentPage >= pageCount}
                    >
                        <span className="sr-only">Trang cuối</span>
                        <ChevronsRight />
                    </Button>
                </div>
            </div>
        </div>
    )
}

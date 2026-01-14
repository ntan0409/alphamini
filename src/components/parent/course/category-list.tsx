
import { Button } from "@/components/ui/button";
import { useCourse } from "@/features/courses/hooks/use-course";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { X } from "lucide-react";
import { Category } from "@/types/courses";


interface CategoryListProps {
    selected: string[];
    onChange: (ids: string[]) => void;
    size?: number;
    currentSearchTerm: string;
    onSearchEmpty?: (term: string) => void; //Callback when search box is cleared
    onSearchEnter: (term: string) => void; //Don't search again on every change, only on Enter key to avoid 429
}


export function CourseFilter({ selected, onChange, size = 20, currentSearchTerm, onSearchEmpty, onSearchEnter }: CategoryListProps) {
    const { useGetCategories } = useCourse();
    const {
        data,
        isLoading
    } = useGetCategories(0, size, undefined);

    const categories = data?.data ?? [];

    const handleSelect = (id: string) => {
        if (!selected.includes(id)) {
            onChange([...selected, id]);
        }
    };

    const removeCategory = (id: string) => {
        onChange(selected.filter((c) => c !== id));
    };

    if (isLoading) {
        return <div className="text-slate-500">Đang tải danh mục...</div>;
    }

    return (
        <div className="flex flex-col gap-3">
            <span>
                <input
                    type="text"
                    defaultValue={currentSearchTerm}
                    onKeyDown={(e) => e.key === "Enter" && onSearchEnter((e.target as HTMLInputElement).value)}
                    placeholder="Tìm kiếm khóa học..."
                    className="w-full px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onChange={(e) => {
                        if (e.target.value === "" && currentSearchTerm !== "") {
                            onSearchEmpty && onSearchEmpty(e.target.value);
                        }
                    }}
                />
            </span>
            {/* Dropdown */}
            <Select onValueChange={handleSelect}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                    {categories.map((cat: Category) => (
                        <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Selected list */}
            <div className="flex flex-wrap gap-2">
                {selected.map((id) => {
                    const cat = categories.find((c: Category) => c.id === id);
                    if (!cat) return null;
                    return (
                        <div
                            key={id}
                            className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full cursor-pointer hover:bg-blue-200"
                            onClick={() => removeCategory(id)}
                        >
                            <span>{cat.name}</span>
                            <X className="h-4 w-4" />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
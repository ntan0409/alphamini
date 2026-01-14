import { Course, formatPrice } from "@/types/courses";

export function CourseSidebar({ data }: { data: Course }) {
    return (
        <aside className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden sticky top-6">
            {data.imageUrl ? (
                <img src={data.imageUrl} alt={data.name} className="w-full h-56 object-cover" />
            ) : (
                <div className="w-full h-56 bg-slate-200 flex items-center justify-center text-6xl">📚</div>
            )}

            <div className="p-6">
                <div className="text-center mb-6 bg-slate-50 rounded-xl p-6 border border-slate-200">
                    <span className="text-4xl font-bold text-blue-600">{formatPrice(data.price)}</span>
                    {data.price === 0 && (
                        <span className="ml-3 px-4 py-1 bg-green-500 text-white text-sm font-bold rounded-full">
                            Miễn phí
                        </span>
                    )}
                </div>

                <button className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-blue-700">
                    Đăng ký khóa học ngay
                </button>
            </div>
        </aside>
    );
}

import { cn } from "@/lib/utils";
import { Course, formatTimespan, mapDifficulty } from "@/types/courses";

export function CourseHeader({ data }: { data: Course }) {
    const dif = mapDifficulty(data.level)
    return (
        <header className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">{data.name}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className={cn("flex items-center gap-2 px-3 py-2 rounded-full font-semibold", dif.color, dif.bg)}>
                    {dif.text}
                </span>
                <span className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-full text-blue-700 font-semibold">
                    📚 {data.totalLessons} bài học
                </span>
                <span className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-full text-slate-700 font-semibold">
                    ⏱️ {formatTimespan(data.totalDuration)}
                </span>
                {data.requireLicense && (
                    <span className="flex items-center gap-2 bg-red-50 px-3 py-2 rounded-full text-red-700 font-semibold">
                        🔒 Cần có giấy phép
                    </span>
                )}
            </div>
        </header>
    );
}

import { Course } from "@/types/courses";

export function CourseDescription({ data }: { data: Course }) {
  return (
    <section className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Về khóa học này</h2>
      <p className="text-slate-700 leading-relaxed whitespace-pre-line">{data.description}</p>
    </section>
  );
}

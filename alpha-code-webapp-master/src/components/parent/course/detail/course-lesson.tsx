import { formatTimespan, Lesson } from "@/types/courses";

export function CourseLessons({ lessons }: { lessons: Lesson[] }) {
  return (
    <section className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
      <div className="p-6 bg-slate-50 border-b border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800">Nội dung khóa học</h2>
        <p className="text-slate-600 mt-2 text-sm">
          {lessons.length} bài • Tổng cộng{" "}
          {formatTimespan(lessons.reduce((t, l) => t + l.duration, 0))}
        </p>
      </div>
      <div className="divide-y divide-slate-100">
        {lessons
          .sort((a, b) => a.orderNumber - b.orderNumber)
          .map((lesson, i) => (
            <div key={lesson.id} className="p-6 hover:bg-slate-50 transition">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-slate-900">{lesson.title}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-3 py-1 bg-blue-50 rounded-full text-blue-700 text-sm font-semibold">
                      {lesson.type}
                    </span>
                    <span className="px-3 py-1 bg-slate-50 rounded-full text-slate-700 text-sm font-semibold">
                      ⏱️ {formatTimespan(lesson.duration)}
                    </span>
                    {lesson.requireRobot && (
                      <span className="px-3 py-1 bg-red-50 rounded-full text-red-700 text-sm font-semibold">
                        🤖 Cần có robot
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}

import Link from "next/link";

export function CourseError() {
  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-red-50">
      <div className="text-center max-w-md bg-white p-8 rounded-2xl shadow-xl border border-red-200">
        <div className="text-6xl mb-4 animate-bounce">😞</div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Không tìm thấy khóa học</h1>
        <p className="text-slate-600 mb-6">
          Khóa học bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
        <Link href="/parent/courses/my-course" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          ← Về trang My Course
        </Link>
      </div>
    </div>
  );
}

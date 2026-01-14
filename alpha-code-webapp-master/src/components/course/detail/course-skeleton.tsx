export function CourseSkeleton() {
  return (
    <div className="space-y-6 min-h-screen p-12">
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="h-8 md:h-10 bg-slate-200 rounded-xl w-3/4 animate-pulse" />
            {/* Paragraph lines */}
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-4 bg-slate-100 rounded-lg w-full animate-pulse" />
            ))}
            {/* Details grid */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-14 bg-white rounded-xl shadow-sm border border-slate-200 animate-pulse" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-64 bg-slate-200 rounded-xl animate-pulse shadow-md" />
            <div className="h-12 bg-slate-200 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

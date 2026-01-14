export function CourseSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section Skeleton */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              <div className="text-gray-300">›</div>
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <div className="h-10 bg-gray-200 rounded-lg w-3/4 animate-pulse" />
              
              {/* Description lines */}
              <div className="space-y-3">
                <div className="h-4 bg-gray-100 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-100 rounded w-5/6 animate-pulse" />
                <div className="h-4 bg-gray-100 rounded w-4/6 animate-pulse" />
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 pt-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-gray-100 animate-pulse" />
                    <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                {/* Image placeholder */}
                <div className="aspect-video bg-gray-200 animate-pulse" />
                
                <div className="p-6 space-y-4">
                  {/* Price */}
                  <div className="flex justify-center">
                    <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
                  </div>
                  
                  {/* Button */}
                  <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="h-7 w-48 bg-gray-200 rounded animate-pulse" />
              <div className="h-5 w-32 bg-gray-100 rounded animate-pulse" />
            </div>
            <div className="h-4 w-24 bg-gray-100 rounded animate-pulse mt-2" />
          </div>

          {/* Section items */}
          <div className="divide-y divide-gray-100">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                    <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-16 bg-gray-100 rounded animate-pulse" />
                    <div className="w-5 h-5 bg-gray-100 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

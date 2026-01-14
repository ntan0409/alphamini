// Kiểu dữ liệu cơ bản của Bundle
export type Bundle = {
  id: string
  name: string
  description: string
  price: number
  discountPrice: number
  coverImage: string
  status: number
  statusText: string
  createdDate: string
  lastUpdated: string
  courseIds?: string[]
}

// Kiểu dữ liệu khi tạo/cập nhật bundle
export type BundleModal = {
  id?: string
  name: string
  description: string
  price: number
  discountPrice?: number
  status?: number
  coverImage?: string | null      // URL ảnh hiện tại
  image?: File | null             // File upload mới
  courseIds?: string[]            // Các khóa học trong bundle
}

// Kiểu dữ liệu PagedResult cho API bundle
export type PagedBundles = {
  data: Bundle[]
  page: number
  per_page: number
  total_count: number
  total_pages: number
  has_next: boolean
  has_previous: boolean
}

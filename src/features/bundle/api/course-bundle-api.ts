import { coursesHttp } from "@/utils/http"
import {
  CourseBundleAssignRequest,
  CourseInBundle,
} from "@/types/course-bundle"

// 📌 Gắn khóa học vào bundle
export const assignCourseToBundle = async (payload: CourseBundleAssignRequest) => {
  const response = await coursesHttp.post(`/course-bundles`, payload)
  return response.data
}

// 📌 Lấy tất cả khóa học theo bundle
export const getCoursesByBundle = async (bundleId: string) => {
  const response = await coursesHttp.get<CourseInBundle[]>(
    `/course-bundles/get-all-course-by-bundle/${bundleId}`
  )
  return response.data
}

// 📌 Xóa mối quan hệ khóa học – bundle
export const deleteCourseBundle = async (id: string) => {
  const response = await coursesHttp.delete(`/course-bundles/${id}`)
  return response.data
}

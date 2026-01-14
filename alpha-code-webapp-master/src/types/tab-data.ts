import { Dispatch, SetStateAction } from "react"

export interface TabData<T> {
  actions: T[]
  totalPages: number
  currentPage: number
  setCurrentPage: Dispatch<SetStateAction<number>>
  loading: boolean
  error: string | null
}

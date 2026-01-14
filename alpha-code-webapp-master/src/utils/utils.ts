"use client"

import axios, { AxiosError } from 'axios'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export const useQueryString = () => {
  const [searchParamsObject, setSearchParamsObject] = useState({})
  const searchParams = useSearchParams()

  useEffect(() => {
    // Only execute when the page is rendered on the client
    const paramsObject = Object.fromEntries(searchParams.entries())
    setSearchParamsObject(paramsObject)
  }, [searchParams]) // When searchParams changes

  return searchParamsObject
}


export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return axios.isAxiosError(error)
}

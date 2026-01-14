"use client"

import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import 'react-quill-new/dist/quill.snow.css'

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  readOnly?: boolean
}

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Nhập nội dung...",
  className = "",
  readOnly = false
}: RichTextEditorProps) {
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link', 'image'],
      [{ 'align': [] }],
      ['clean']
    ],
  }), [])

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent',
    'link', 'image',
    'align'
  ]

  return (
    <div className={className}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        readOnly={readOnly}
        className={readOnly ? "read-only-editor" : ""}
      />
    </div>
  )
}

// Read-only viewer component
interface RichTextViewerProps {
  content: string
  className?: string
}

export function RichTextViewer({ content, className = "" }: RichTextViewerProps) {
  return (
    <div 
      className={`ql-editor ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
      style={{ padding: 0 }}
    />
  )
}

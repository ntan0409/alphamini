import React from 'react'

interface LearningLayoutProps {
	children: React.ReactNode
}

export default function LearningLayout({ children }: LearningLayoutProps) {
	// Simple layout wrapper for learning routes. Keep minimal — the parent layout already
	// provides header/sidebar. This ensures Next finds a valid default export.
	return <>{children}</>
}

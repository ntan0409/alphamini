"use client"
import { cn } from "@/lib/utils";
import { Course } from "@/types/courses";
import React from 'react'
import CourseCard from './course-card'

interface CourseGridProps {
    courses: Course[];
}

export function CourseGrid({ courses }: CourseGridProps) {
    if (courses.length === 0) {
        return <div className="text-center py-12 text-slate-600">Không có khóa học nào phù hợp</div>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
            {courses.map(course => (
                <CourseCard key={course.id} course={course} variant="grid" />
            ))}
        </div>
    );
}
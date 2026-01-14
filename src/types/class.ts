export type ClassTeacher = {
    classId: string;
    className: string;
    createdDate: string;
    lastUpdate: string;
    status: number;
    statusText: string;
    teacherId: string;
    teacherName: string;
}

export type Class = {
    id: string;
    name: string;
    status: number;
    statusText: string;
    createdDate: string;
    lastUpdate: string;
    teachers: ClassTeacher[];
}

export type ClassResponse = {
    data: Class[];
    total_count: number;
    page: number;
    per_page: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
}
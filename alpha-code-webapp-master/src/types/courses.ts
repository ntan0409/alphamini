import { AccountLesson } from "./account-lessons"

export type Category = {
    id: string,
    name: string,
    description: string,
    slug: string,
    imageUrl: string,
    status: number,
    lastUpdated?: string,
    createdDate: string
    countCourses?: number
}

export interface Lesson {
    id: string; // uuid
    sectionId: string; // uuid
    title: string; // varchar(255)
    slug: string; // varchar(255) - unique identifier for URL
    content: string; // text
    videoUrl?: string; // varchar(512) - nullable
    duration: number; // int4 (in seconds)
    requireRobot: boolean; // bool
    solution?: string; // jsonb - nullable
    orderNumber: number; // int4
    type: number; // int4 - lesson type
    typeText?: string;
    status: number; // int4
    statusText?: string;
    createdDate: string; // timestamp
    lastUpdated?: string; // timestamp
}

export interface Section {
    id: string; // uuid
    courseId: string; // uuid
    title: string; // varchar(255)
    orderNumber: number; // int4
    createdDate?: string | null; // timestamp - nullable
    lastUpdated?: string | null; // timestamp - nullable
    status: number; // int4
    statusText?: string; // status text
    lessons?: Lesson[]; // for non-account specific queries
    accountLessons?: AccountLesson[]; // for account-specific queries with progress
}

export interface Course {
    id: string; // uuid
    name: string; // varchar(255)
    description: string; // text
    price: number; // integer (in VND)
    requireLicense: boolean; // bool
    level: number; // int4
    totalLessons: number; // int4
    totalDuration: number; // int4 (in seconds)
    imageUrl?: string; // varchar(512) - nullable
    slug: string; // varchar(255) - unique
    categoryId: string; // uuid
    status: number; // int4
    createdDate: string; // timestamp
    lastUpdated?: string; // timestamp
    categoryName?: string;
    sectionCount?: number;
    statusText?: string;
    levelText?: string; // Added field for level text
}

// export interface AccountCourse {
//     accountId: string;
//     completed: boolean;
//     completedLesson: number;
//     courseId: string;
//     id: string;
//     lastAccessed: string; // or Date if you plan to parse it
//     progressPercent: number;
//     purchaseDate: string; // or Date if you plan to parse it
//     status: number;
//     statusText: string;
//     totalLesson: number;
//     slug: string,
//     imageUrl: string,
//     name: string
// }

// export interface AccountLesson {
//     duration: number;
//     id: string;
//     status: number;
//     title: string;
// }

export function mapDifficulty(d: number) {
    switch (d) {
        case 3: return {
            text: 'Cơ bản',
            color: 'text-blue-500',
            bg: 'bg-blue-500/10'
        }
        case 4: return {
            text: 'Trung bình',
            color: 'text-green-500',
            bg: 'bg-green-500/10'
        }
        case 5: return {
            text: 'Nâng cao',
            color: 'text-yellow-500',
            bg: 'bg-yellow-500/10'
        }
    }
    return {
        text: '',
        color: 'text-red-500',
        bg: 'bg-red-500/10'
    }
}

//Round to nearest hour
export function formatTimespan(seconds: number): string {
    if (seconds < 0) {
        throw new Error('Seconds cannot be negative');
    }

    if (seconds === 0) {
        return '0s';
    }

    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    const remainingSeconds = seconds % 60;

    if (days > 0) {
        if (hours >= 12) {
            return `${days} ngày ${hours} giờ`;
        }
        return `${days} ngày`;
    }
    if (hours > 0) {
        if (minutes >= 15) {
            return `${hours} giờ ${minutes} phút`;
        }
        return `${hours} phút`;
    }
    if (minutes > 0) {
        return `${minutes} phút`;
    }
    return `${remainingSeconds} giây`;
}

export function formatPrice(price: number): string {
    return price.toLocaleString('vi-VN') + ' VND';
}
export type MakerRequest = {
    name: string;
    status: 'active' | 'inactive' | 'pending';
    activityId: string;
}

export type Maker = {
    id: string;
    name: string;
    status: number;
    createdDate: string;
    lastEdited: string | null;
    statusText: string;
    activityId: string;
    activityName: string;
}

export type MakerResponse = {
    data: Maker[];
    total_count: number;
    page: number;
    per_page: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
}

// Types for query parameters
export interface MakerQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    activityId?: string;
}
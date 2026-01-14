export type QRCodeRequest = {
    name: string;
    qrCode: string;
    status: number; // 1 for enabled, 0 for disabled
    activityId: string;
    accountId: string;
    color: string;
}

export type QRCode = {
    id: string;
    name: string;
    color: string;
    qrCode: string;
    status: number;
    createdDate: string;
    lastEdited: string | null;
    imageUrl: string;
    activityName: string;
    activityId: string;
    accountId: string;
    statusText: string;
}

// Type for paginated QR codes response
export type QRCodesResponse = {
    data: QRCode[];
    total_count: number;
    page: number;
    per_page: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
}

// Types for query parameters
export interface QRCodesQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    activityId?: string;
}

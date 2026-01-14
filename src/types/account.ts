export type Account = {
  id: string;
  username: string;
  password?: string;
  fullName: string;
  phone: string;
  email: string;
  gender: number;
  createdDate: string;
  lastEdited: string | null;
  status: number;
  image: string;
  bannedReason: string | null;
  roleId: string;
  roleName: string;
  statusText: string;
};

export type AccountData = {
  id: string;
  username: string;
  email: string;
  fullName: string;
  roleName: string;
  roleId: string;
}

// Type for paginated accounts response
export type AccountsResponse = {
  data: Account[];
  total_count: number;
  page: number;
  per_page: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

// Types for query parameters
export interface AccountsQueryParams {
  page?: number
  limit?: number
  search?: string
  role?: string
  status?: string
}

// Type for creating new account
export interface CreateAccountRequest {
  username: string
  fullName: string
  email: string
  password: string
  phone: string
  gender: number
  roleId: string
}

export interface RegisterAccount {
  username: string;
  password: string;
  email: string;
  fullName: string;
  phone: string
  gender: number;
  avatarFile?: File;
}

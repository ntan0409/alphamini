import { Account } from '@/types/account';
import { PagedResult } from '@/types/page-result';
import { usersHttp } from '@/utils/http';
export const getAllAccounts = async (params?: { page?: number; per_page?: number; search?: string; role?: string }) => {
  try {
    const response = await usersHttp.get<PagedResult<Account>>('/accounts', {
      params: {
        page: params?.page,
        per_page: params?.per_page,
        search: params?.search,
        role: params?.role,
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAccountById = async (id: string) => {
  const response = await usersHttp.get<Account>(`/accounts/${id}`);
  return response.data;
};

export const createAccount = async (accountData: Omit<Account, 'id' | 'createdDate' | 'lastEdited'> & { avatarFile?: File }) => {
  try {
    // Create FormData for multipart/form-data request
    const formData = new FormData();

    // Add all text fields
    formData.append('username', accountData.username);
    formData.append('email', accountData.email);
    formData.append('fullName', accountData.fullName);
    if (accountData.password) {
      formData.append('password', accountData.password);
    }
    formData.append('phone', accountData.phone);
    formData.append('roleId', accountData.roleId);
    formData.append('gender', accountData.gender.toString());

    // Add file if present
    if (accountData.avatarFile) {
      formData.append('avatarFile', accountData.avatarFile);
    }

    const response = await usersHttp.post('/accounts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error: unknown) {

    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response: { status: number; data?: { message?: string } } };
      const status = axiosError.response.status;
      const data = axiosError.response.data;

      switch (status) {
        case 409:
          // Conflict - usually duplicate username or email
          if (data?.message) {
            throw new Error(`Conflict: ${data.message}`);
          } else {
            throw new Error('Username or email already exists. Please choose different values.');
          }
        case 400:
        case 422:
          // Bad Request / Unprocessable Entity - validation errors
          if (data?.message && typeof data.message === 'object') {
            // For validation errors, throw the entire response as JSON string
            throw new Error(JSON.stringify(data));
          } else if (data?.message) {
            throw new Error(`Validation Error: ${data.message}`);
          } else {
            throw new Error('Invalid data provided. Please check all fields.');
          }
        case 401:
          throw new Error('Unauthorized. Please login again.');
        case 403:
          throw new Error('Permission denied. You do not have access to create accounts.');
        case 500:
          throw new Error('Server error. Please try again later.');
        default:
          // Handle validation errors with detailed messages
          if (data?.message && typeof data.message === 'object') {
            // For validation errors, throw the entire response as JSON string
            throw new Error(JSON.stringify(data));
          } else {
            throw new Error(`Error ${status}: ${data?.message || 'Unknown server error'}`);
          }
      }
    } else if (error && typeof error === 'object' && 'request' in error) {
      throw new Error('Network error. Please check your internet connection.');
    } else {
      throw new Error('An unexpected error occurred. Please try again.');
    }
  }
};

export const updateAccount = async (id: string, accountData: Partial<Omit<Account, 'id' | 'createdDate'>>) => {
  const response = await usersHttp.patch(`/accounts/${id}`, accountData);
  return response.data;
};

// Change status endpoint - prefer this API for banning/activating users instead of patch
export const changeAccountStatus = async (id: string, status: number, bannedReason?: string | null) => {
  // Assume backend exposes a dedicated endpoint for status changes
  // e.g. POST /accounts/{id}/status with body { status, bannedReason }
  const payload: Record<string, unknown> = { status };
  if (bannedReason !== undefined) payload.bannedReason = bannedReason;
  const response = await usersHttp.patch(
    `/accounts/${id}/change-status`,
    null, // body rỗng
    {
      params: {
        status,
        bannedReason,
      },
    }
  );
  return response.data;
};

export const deleteAccount = async (id: string) => {
  const response = await usersHttp.delete(`/accounts/${id}`);
  return response.data;
};
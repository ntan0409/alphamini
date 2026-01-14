import {QRCodeRequest, QRCodesResponse} from '@/types/qrcode';
import { activitiesHttp } from '@/utils/http';

export const createQRCode = async (data: QRCodeRequest): Promise<QRCodesResponse> => {
  const response = await activitiesHttp.post('/qr-codes', data);
  return response.data;
};

export const getQRCodeById = async (id: string): Promise<QRCodesResponse> => {
  const response = await activitiesHttp.get(`/qr-codes/${id}`);
  return response.data;
};

export const updateQRCode = async (id: string, data: Partial<QRCodeRequest>): Promise<QRCodesResponse> => {
  const response = await activitiesHttp.put(`/qr-codes/${id}`, data);
  return response.data;
};

export const deleteQRCode = async (id: string): Promise<void> => {
  await activitiesHttp.delete(`/qr-codes/${id}`);
};

export const getAllQRCodes = async ({
  page = 1,
  size = 10,
  status,
  accountId,
}: {
  page?: number;
  size?: number;
  status?: number | null;
  accountId: string;
}): Promise<QRCodesResponse> => {
  try {
    const response = await activitiesHttp.get<QRCodesResponse>('/qr-codes', {
      params: {
        page,
        size,
        status,
        accountId,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};


export const updateQRCodeStatus = async (id: string, status: number): Promise<QRCodesResponse> => {
  // Backend expects status as a request param, not in the JSON body
  const response = await activitiesHttp.patch(`/qr-codes/${id}/status`, null, {
    params: { status }
  });
  return response.data;
};

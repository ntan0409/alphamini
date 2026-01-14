import { CreateCardData, OsmoCard } from '@/types/osmo-card';
import { PagedResult } from '@/types/page-result';
import { activitiesHttp } from '@/utils/http';

export const getAllOsmoCards = async () => {
  try {
    const response = await activitiesHttp.get<PagedResult<OsmoCard>>('/osmo-cards');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getOsmoCardById = async (id: string) => {
  const response = await activitiesHttp.get<OsmoCard>(`/osmo-cards/${id}`);
  return response.data;
};

export const createOsmoCard = async (osmoCardData: CreateCardData) => {
  const response = await activitiesHttp.post('/osmo-cards', osmoCardData);
  return response.data;
};

// PATCH update - only updates provided fields
export const updateOsmoCard = async (id: string, osmoCardData: Partial<Omit<OsmoCard, 'id' | 'createdDate'>>) => {
  const response = await activitiesHttp.patch(`/osmo-cards/${id}`, osmoCardData);
  return response.data;
};

export const deleteOsmoCard = async (id: string) => {
  const response = await activitiesHttp.delete(`/osmo-cards/${id}`);
  return response.data;
};
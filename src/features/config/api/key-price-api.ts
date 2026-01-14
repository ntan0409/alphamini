import { KeyPrice } from '@/types/key-price';
import { paymentsHttp } from '@/utils/http';
import axios from 'axios';

// Note: avoid UI side-effects (toasts) inside API functions; handle UI in hooks/components

export const getKeyPrice = async (): Promise<KeyPrice | null> => {
  try {
    const response = await paymentsHttp.get('/key-prices');
    return response.data;
  } catch (error: unknown) {
    // If backend returns 404 when no key price exists, treat it as "no data" instead of throwing.
    // Use axios.isAxiosError to safely narrow the unknown error.
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }

    // rethrow other errors so callers can handle them
    throw error;
  }
};


export const createKeyPrice = async (price: number): Promise<KeyPrice> => {
  try {
    const response = await paymentsHttp.post('/key-prices', price );
    return response.data;
  } catch (error) {
    console.error('Error creating key price:', error);
    throw new Error('Failed to create key price');
  }
};

export const updateKeyPrice = async (id: string, price: number): Promise<KeyPrice> => {
  try {
    const response = await paymentsHttp.put(`/key-prices/${id}`, price );
    return response.data;
  } catch (error) {
    console.error('Error updating key price:', error);
    throw new Error('Failed to update key price');
  }
};


export const deleteKeyPrice = async (id: string): Promise<void> => {
  try {
    await paymentsHttp.delete(`/key-prices/${id}`);
  } catch (error) {
    console.error('Error deleting key price:', error);
    throw new Error('Failed to delete key price');
  }
};

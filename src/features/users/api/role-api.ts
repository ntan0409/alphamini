import { Role } from '@/types/role';
import { usersHttp } from '@/utils/http';

export const getRoles = async () => {
  const response = await usersHttp.get('/roles');
  return response.data;
};

export const getRoleById = async (id: string) => {
  const response = await usersHttp.get(`/roles/${id}`);
  return response.data;
};

export const createRole = async (roleData: Omit<Role, 'id'>) => {
  const response = await usersHttp.post('/roles', roleData);
  return response.data;
};

export const updateRole = async (id: string, roleData: Partial<Omit<Role, 'id'>>) => {
  const response = await usersHttp.put(`/roles/${id}`, roleData);
  return response.data;
};

export const deleteRole = async (id: string) => {
  const response = await usersHttp.delete(`/roles/${id}`);
  return response.data;
};

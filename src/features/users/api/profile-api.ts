import { PagedResult } from "@/types/page-result";
import { Profile } from "@/types/profile";
import { usersHttp } from "@/utils/http";


export const getUserprofile = async () => {
    try {
        const response = await usersHttp.get<PagedResult<Profile>>(`/profiles`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
};

export const getProfileByAccountId = async (accountId: string) => {
    try {
        const response = await usersHttp.get<Profile>(`/profiles/account/${accountId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
};

export const updateUserProfile = async (profileData: Partial<Profile>) => {
    try {
        const response = await usersHttp.put<Profile>(`/profiles/${profileData.id}`, profileData);
        return response.data;
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
    }
};

export const getProfileById = async (id: string) => {
    try {
        const response = await usersHttp.get<Profile>(`/profiles/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
};  

export const createUserProfile = async (profileData: Omit<Profile, 'id' | 'createDate' | 'lastUpdated'>) => {
    try {
        const response = await usersHttp.post<Profile>(`/profiles`, profileData);
        return response.data;
    } catch (error) {
        console.error("Error creating user profile:", error);
        throw error;
    }
};

export const deleteUserProfile = async (id: string) => {
    try {
        const response = await usersHttp.delete<void>(`/profiles/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting user profile:", error);
        throw error;
    }
};

export const updateUserAvatar = async (id: string, avatarUrl: string) => {
    try {
        const response = await usersHttp.patch<Profile>(`/profiles/${id}/avatar`, { avartarUrl: avatarUrl });
        return response.data;
    } catch (error) {
        console.error("Error updating user avatar:", error);
        throw error;
    }
};


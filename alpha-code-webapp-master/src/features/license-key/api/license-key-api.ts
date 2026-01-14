import { paymentsHttp } from "@/utils/http";

export const getLicenseKey = async (accountId: string): Promise<string> => {
    try {
        const response = await paymentsHttp.get<string>('/license-keys/by-account/' + accountId)
        return response.data
    }
    catch (error) {
        console.error("API Error in getLicenseKey:", error);
        throw error;    
    }
}

export const validateLicenseKey = async (accountId: string, licenseKey: string): Promise<boolean> => {
    try {
        const response = await paymentsHttp.get<boolean>('/license-keys/validate-key', {
            params: {
                accountId,
                key: licenseKey
            }
        })
        return response.data
    }
    catch (error) {
        console.error("API Error in validateLicenseKey:", error);
        throw error;
    }
}

export const getUserLicenseInfo = async (accountId: string, signal?: AbortSignal) => {
    try {
        const response = await paymentsHttp.get(`/license-keys/user-license-info/${accountId}`, {
            signal,
        })
        return response.data
    }
    catch (error) {
        console.error("API Error in getUserLicenseInfo:", error);
        throw error;
    }
}

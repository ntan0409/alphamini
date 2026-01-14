import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerAccount } from "../api/auth-api";

export const useRegisterAccount = () => {

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (accountData: { 
            username: string; 
            password: string; 
            email: string; 
            fullName: string; 
            phone: string; 
            gender: number; 
            avatarFile?: File; 
        }) => registerAccount(accountData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
        },
    });
    
};
import { getAllAccounts, getAccountById, createAccount, updateAccount, deleteAccount, changeAccountStatus } from "@/features/users/api/account-api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Account } from "@/types/account";
import { PagedResult } from "@/types/page-result";

export const useAccount = () => {
    const queryClient = useQueryClient();

    // Get all accounts
    const useGetAllAccounts = (params?: { page?: number; per_page?: number; search?: string; role?: string }) => {
        return useQuery<PagedResult<Account>>({
            queryKey: ['accounts', params || {}],
            staleTime: 0,
            queryFn: () => getAllAccounts(params),
        });
    };

    // Get account by ID
    const useGetAccountById = (id: string) => {
        return useQuery<Account>({
            queryKey: ['account', id],
            staleTime: 0,
            queryFn: () => getAccountById(id),
            enabled: !!id,
        });
    };

    // Create account mutation
    const useCreateAccount = () => {
        return useMutation({
            mutationFn: createAccount,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['accounts'] });
            },
        });
    };

    // Update account mutation
    const useUpdateAccount = () => {
        return useMutation({
            mutationFn: ({ id, accountData }: { id: string; accountData: Partial<Omit<Account, 'id' | 'createdDate'>> }) => 
                updateAccount(id, accountData),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['accounts'] });
            },
        });
    };

    // Change status (ban / activate) - use dedicated API
    const useChangeAccountStatus = () => {
        return useMutation({
            mutationFn: ({ id, status, bannedReason }: { id: string; status: number; bannedReason?: string | null }) =>
                changeAccountStatus(id, status, bannedReason),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['accounts'] });
            }
        });
    };

    // Delete account mutation
    const useDeleteAccount = () => {
        return useMutation({
            mutationFn: deleteAccount,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['accounts'] });
            },
        });
    };

    return {
        useGetAllAccounts,
        useGetAccountById,
        useCreateAccount,
        useUpdateAccount,
        useChangeAccountStatus,
        useDeleteAccount,
    };
};

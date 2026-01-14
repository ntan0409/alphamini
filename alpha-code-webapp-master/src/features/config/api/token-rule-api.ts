import { TokenRule, CreateTokenRuleRequest, UpdateTokenRuleRequest, PatchTokenRuleRequest } from '@/types/pricing';
import { PagedResult } from '@/types/page-result';
import { paymentsHttp } from '@/utils/http';

// Token Rule API - for managing token costs across different services (NLP, AI, etc.)
// Note: avoid UI side-effects (toasts) inside API functions; handle UI in hooks/components

export const getTokenRules = async (
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<PagedResult<TokenRule>> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      // backend expects `size` rather than `limit`
      size: limit.toString(),
    });
    
    if (search && search.trim()) {
      params.append('search', search.trim());
    }

    const response = await paymentsHttp.get(`/token-rules?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching token rules:', error);
    throw new Error('Failed to fetch token rules');
  }
};

export const getTokenRuleById = async (id: string): Promise<TokenRule> => {
  try {
    const response = await paymentsHttp.get(`/token-rules/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching token rule:', error);
    throw new Error('Failed to fetch token rule');
  }
};

export const createTokenRule = async (payload: CreateTokenRuleRequest): Promise<TokenRule> => {
  try {
    const response = await paymentsHttp.post('/token-rules', payload);
    return response.data as TokenRule;
  } catch (error) {
    console.error('Error creating token rule:', error);
    throw new Error('Failed to create token rule');
  }
};

export const updateTokenRule = async (payload: UpdateTokenRuleRequest): Promise<TokenRule> => {
  try {
    const response = await paymentsHttp.put(`/token-rules/${payload.id}`, payload);
    return response.data as TokenRule;
  } catch (error) {
    console.error('Error updating token rule:', error);
    throw new Error('Failed to update token rule');
  }
};

export const patchTokenRule = async (id: string, patch: PatchTokenRuleRequest): Promise<TokenRule> => {
  try {
    const response = await paymentsHttp.patch(`/token-rules/${id}`, patch);
    return response.data as TokenRule;
  } catch (error) {
    console.error('Error patching token rule:', error);
    throw new Error('Failed to patch token rule');
  }
};

export const deleteTokenRule = async (id: string): Promise<void> => {
  try {
    await paymentsHttp.delete(`/token-rules/${id}`);
  } catch (error) {
    console.error('Error deleting token rule:', error);
    throw new Error('Failed to delete token rule');
  }
};
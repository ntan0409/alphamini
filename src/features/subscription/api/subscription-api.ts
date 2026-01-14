import { SubscriptionPlan, SubscriptionPlanModal } from "@/types/subscription";
import { PagedResult } from "@/types/page-result";
import { paymentsHttp } from "@/utils/http";

export const getPagedSubscriptions = async (
  page: number,
  size: number,
  search?: string,
  signal?: AbortSignal,
) => {
  try {
    const response = await paymentsHttp.get<PagedResult<SubscriptionPlan>>("/subscription-plans", {
      params: {
        page,
        size,
        search,
      },
      signal,
    });

    return response.data;
  } catch (error) {
    console.error("API Error in getPagedSubscriptionPlan:", error);
    throw error;
  }
};

export const createSubscription = async (subscriptionData: SubscriptionPlanModal) => {
  const response = await paymentsHttp.post('/subscription-plans', subscriptionData);
  return response.data;
};

export const updateSubscription = async (id: string, subscriptionData: SubscriptionPlanModal) => {
  const response = await paymentsHttp.put(`/subscription-plans/${id}`, subscriptionData);
  return response.data;
};

export const deleteSubscription = async (id: string) => {
  const response = await paymentsHttp.delete(`/subscription-plans/${id}`);
  return response.data;
};

export const getSubscriptionById = async (id: string) => {
  const response = await paymentsHttp.get(`/subscription-plans/${id}`)
  return response.data
}

export const getUserSubscriptionDashboard = async (accountId: string, signal?: AbortSignal) => {
  try {
    const response = await paymentsHttp.get(`/subscriptions/dashboard/${accountId}`, {
      signal,
    });
    return response.data;
  } catch (error) {
    console.error("API Error in getUserSubscriptionDashboard:", error);
    throw error;
  }
};
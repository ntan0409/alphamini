import { Expression, ExpressionModal } from "@/types/expression";
import { PagedResult } from "@/types/page-result";
import { activitiesHttp } from "@/utils/http";

// ✅ Thêm robotModelId filter vào params
export const getPagedExpressions = async (
  page: number,
  size: number,
  search?: string,
  robotModelId?: string,
  signal?: AbortSignal
) => {
  try {
    const response = await activitiesHttp.get<PagedResult<Expression>>("/expressions", {
      params: {
        page,
        size,
        search,
        robotModelId, // ✅ thêm vào query params
      },
      signal,
    });

    return response.data;
  } catch (error) {
    console.error("API Error in getPagedExpressions:", error);
    throw error;
  }
};

export const createExpression = async (expressionData: ExpressionModal) => {
  const response = await activitiesHttp.post("/expressions", expressionData);
  return response.data;
};

export const updateExpression = async (id: string, expressionData: ExpressionModal) => {
  const response = await activitiesHttp.put(`/expressions/${id}`, expressionData);
  return response.data;
};

export const deleteExpression = async (id: string) => {
  const response = await activitiesHttp.delete(`/expressions/${id}`);
  return response.data;
};

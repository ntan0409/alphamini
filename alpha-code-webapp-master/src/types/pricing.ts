export interface TokenPricingConfig {
  id: string
  value: number
  note?: string
  createdAt: string
  updatedAt: string
}

export interface UpdateTokenPricingRequest {
  value: number
  note?: string
}

// Token Rule for various services (NLP, AI, API calls, etc.)
export interface TokenRule {
  id: string
  code: string          // Service identifier (e.g., "NLP_TOKEN", "AI_SERVICE", "API_CALL")
  cost: number          // Cost per token usage in VND
  note?: string         // Optional description/notes
  createdDate: string
  lastUpdated: string
}

// Request/DTO shapes for TokenRule endpoints
export interface CreateTokenRuleRequest {
  code: string
  cost: number
  note?: string
}

export interface UpdateTokenRuleRequest {
  id: string
  code: string
  cost: number
  note?: string
  status?: number
}

export type PatchTokenRuleRequest = Partial<{
  code: string
  cost: number
  note: string
}>;

export interface LicensePricingConfig {
  id: string
  value: number
  note?: string
  createdAt: string
  updatedAt: string
}

export interface UpdateLicensePricingRequest {
  value: number
  note?: string
}
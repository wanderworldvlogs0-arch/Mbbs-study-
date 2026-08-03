export type SubscriptionPlanId = "free" | "pro" | "elite";

export interface SubscriptionStatus {
  plan: SubscriptionPlanId;
}

export interface SelectPlanRequest {
  planId: SubscriptionPlanId;
}

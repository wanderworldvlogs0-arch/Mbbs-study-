export type SubscriptionPlanId = "free" | "pro" | "elite";

export interface SubscriptionStatus {
  plan: SubscriptionPlanId;
  subscriptionExpiresAt: string | null;
}

export interface SelectPlanRequest {
  planId: SubscriptionPlanId;
  billing?: "monthly" | "yearly";
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Premium packages, prices and payment accounts. Edit this file to change pricing or wallets.

export type PackageId = 'workout' | 'diet';
export type PlanId = 'full' | 'monthly';
export type PaymentMethodId = 'kbzpay' | 'wavepay' | 'cbpay';

export interface PremiumPackage {
  id: PackageId;
  name: string;
  tagline: string;
  features: string[];
}

export interface PricingPlan {
  id: PlanId;
  name: string;
  priceKs: number;
  billing: string;
  /** Months of access per payment; null = no expiry */
  durationMonths: number | null;
}

export interface PaymentMethod {
  id: PaymentMethodId;
  name: string;
  accountName: string;
  accountNumber: string;
}

export const PREMIUM_PACKAGES: Record<PackageId, PremiumPackage> = {
  workout: {
    id: 'workout',
    name: 'Premium Workout',
    tagline: 'Coach-guided training sessions',
    features: [
      'Guided workout sessions with live set & rest timer',
      'Audio cues and countdowns for every exercise',
      'Automatic calorie tracking when you finish',
      'All signature programmes, including Abs Blaster'
    ]
  },
  diet: {
    id: 'diet',
    name: 'Premium Diet',
    tagline: 'Meal plans and hands-free cooking',
    features: [
      'Daily meal planner with one-tap diary logging',
      'Hands-Free Cook Mode with step timers & voice guidance',
      'Chef recipes scaled to your servings',
      'Macro-balanced plans for your calorie goal'
    ]
  }
};

export const PRICING_PLANS: Record<PlanId, PricingPlan> = {
  full: {
    id: 'full',
    name: 'Full Package',
    priceKs: 65000,
    billing: 'one-time payment',
    durationMonths: null
  },
  monthly: {
    id: 'monthly',
    name: 'Monthly Plan',
    priceKs: 20000,
    billing: 'per month',
    durationMonths: 1
  }
};

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'kbzpay', name: 'KBZPay', accountName: 'PulseFit', accountNumber: '09-766-050-139' },
  { id: 'wavepay', name: 'WavePay', accountName: 'PulseFit', accountNumber: '09-766-050-139' },
  { id: 'cbpay', name: 'CB Pay', accountName: 'PulseFit', accountNumber: '09-766-050-139' }
];

export const formatKs = (amount: number) => `${amount.toLocaleString('en-US')} Ks`;

/** A package purchase. Starts as 'pending' until the transfer is verified. */
export interface Purchase {
  packageId: PackageId;
  planId: PlanId;
  methodId: PaymentMethodId;
  transactionId: string;
  payerPhone: string;
  status: 'pending' | 'active';
  submittedAt: string;
  /** ISO date access ends (monthly plans only), set when activated */
  expiresAt: string | null;
}

export type Purchases = Partial<Record<PackageId, Purchase>>;

export function hasActiveAccess(purchase: Purchase | undefined, now = new Date()): boolean {
  if (!purchase || purchase.status !== 'active') return false;
  return purchase.expiresAt === null || new Date(purchase.expiresAt) > now;
}

export function activatePurchase(purchase: Purchase, now = new Date()): Purchase {
  const months = PRICING_PLANS[purchase.planId].durationMonths;
  let expiresAt: string | null = null;
  if (months !== null) {
    const end = new Date(now);
    end.setMonth(end.getMonth() + months);
    expiresAt = end.toISOString();
  }
  return { ...purchase, status: 'active', expiresAt };
}

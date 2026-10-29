import React from 'react';
import { Crown, Dumbbell, Salad, Check, Clock, BadgeCheck } from 'lucide-react';
import {
  PackageId,
  PlanId,
  Purchases,
  PREMIUM_PACKAGES,
  PRICING_PLANS,
  PAYMENT_METHODS,
  formatKs,
  hasActiveAccess
} from '../../data/premium';

interface Props {
  purchases: Purchases;
  onBuy: (packageId: PackageId, planId: PlanId) => void;
  /** Dev-only: marks a pending payment as verified, standing in for the admin check */
  onDemoApprove?: (packageId: PackageId) => void;
}

const THEME: Record<PackageId, { icon: React.ReactNode; accent: string; ring: string; button: string }> = {
  workout: {
    icon: <Dumbbell className="w-6 h-6" aria-hidden="true" />,
    accent: 'text-rose-700 bg-rose-500/15',
    ring: 'border-rose-500/30',
    button: 'bg-rose-500 hover:bg-rose-400'
  },
  diet: {
    icon: <Salad className="w-6 h-6" aria-hidden="true" />,
    accent: 'text-emerald-800 bg-emerald-500/15',
    ring: 'border-emerald-500/30',
    button: 'bg-emerald-400 hover:bg-emerald-300'
  }
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export const PremiumView: React.FC<Props> = ({ purchases, onBuy, onDemoApprove }) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 text-slate-100">
      <header className="space-y-2 text-center sm:text-left">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 text-amber-800 text-xs font-black uppercase tracking-widest">
          <Crown className="w-3.5 h-3.5" aria-hidden="true" /> PulseFit Premium
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-50">Train and eat with a plan</h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
          Pick the package you need. Pay once for the full package, or go month by month.
          Pay with {PAYMENT_METHODS.map(m => m.name).join(', ')}.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-5">
        {(Object.values(PREMIUM_PACKAGES)).map(pkg => {
          const theme = THEME[pkg.id];
          const purchase = purchases[pkg.id];
          const active = hasActiveAccess(purchase);
          const pending = purchase?.status === 'pending';
          const expired = purchase?.status === 'active' && !active;

          return (
            <section
              key={pkg.id}
              aria-labelledby={`pkg-${pkg.id}`}
              className={`flex flex-col p-6 rounded-3xl bg-slate-900 border ${theme.ring} shadow-xl`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${theme.accent}`}>{theme.icon}</div>
                {active && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-400/15 text-emerald-800 text-xs font-bold">
                    <BadgeCheck className="w-3.5 h-3.5" aria-hidden="true" /> Active
                  </span>
                )}
                {pending && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400/15 text-amber-800 text-xs font-bold">
                    <Clock className="w-3.5 h-3.5" aria-hidden="true" /> Verifying payment
                  </span>
                )}
              </div>

              <h2 id={`pkg-${pkg.id}`} className="mt-4 text-xl font-black text-slate-50">{pkg.name}</h2>
              <p className="text-sm text-slate-400">{pkg.tagline}</p>

              <ul className="mt-4 space-y-2.5 flex-1">
                {pkg.features.map(f => (
                  <li key={f} className="flex gap-2.5 text-sm text-slate-200">
                    <Check className="w-4 h-4 mt-0.5 shrink-0 text-emerald-700" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                {active && purchase ? (
                  <p className="p-4 rounded-2xl bg-slate-800/60 text-sm text-slate-200">
                    {purchase.expiresAt
                      ? <>Monthly plan · renews by {formatDate(purchase.expiresAt)}</>
                      : <>Full package · yours to keep</>}
                  </p>
                ) : pending && purchase ? (
                  <div className="p-4 rounded-2xl bg-slate-800/60 space-y-2">
                    <p className="text-sm text-slate-200">
                      {PRICING_PLANS[purchase.planId].name} · {formatKs(PRICING_PLANS[purchase.planId].priceKs)} submitted on {formatDate(purchase.submittedAt)}.
                      {' '}It unlocks once the payment is confirmed.
                    </p>
                    <p className="text-xs text-slate-400 font-mono">Transaction ID: {purchase.transactionId}</p>
                    {onDemoApprove && (
                      <button
                        type="button"
                        onClick={() => onDemoApprove(pkg.id)}
                        className="text-xs font-bold text-amber-800 hover:text-amber-800 underline underline-offset-2"
                      >
                        Approve payment (dev only)
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {expired && <p className="text-sm text-amber-800">Your monthly plan has ended. Renew to keep access.</p>}
                    <button
                      type="button"
                      onClick={() => onBuy(pkg.id, 'full')}
                      className={`w-full min-h-12 px-4 rounded-2xl ${theme.button} text-ink font-black text-sm flex items-center justify-between gap-3 transition-colors`}
                    >
                      <span>{PRICING_PLANS.full.name}</span>
                      <span className="font-mono">{formatKs(PRICING_PLANS.full.priceKs)} <span className="font-sans font-semibold opacity-80">once</span></span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onBuy(pkg.id, 'monthly')}
                      className="w-full min-h-12 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-50 font-bold text-sm flex items-center justify-between gap-3 transition-colors"
                    >
                      <span>{PRICING_PLANS.monthly.name}</span>
                      <span className="font-mono">{formatKs(PRICING_PLANS.monthly.priceKs)} <span className="font-sans font-semibold text-slate-400">/ month</span></span>
                    </button>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

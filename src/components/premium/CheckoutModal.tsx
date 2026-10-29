import React, { useEffect, useState } from 'react';
import { X, Check, Copy, CheckCircle2, Clock, Crown, Wallet } from 'lucide-react';
import {
  PackageId,
  PlanId,
  PaymentMethodId,
  Purchase,
  PREMIUM_PACKAGES,
  PRICING_PLANS,
  PAYMENT_METHODS,
  formatKs
} from '../../data/premium';

interface Props {
  packageId: PackageId | null;
  initialPlan?: PlanId;
  onClose: () => void;
  onSubmit: (purchase: Purchase) => void;
}

export const CheckoutModal: React.FC<Props> = ({ packageId, initialPlan = 'full', onClose, onSubmit }) => {
  const [planId, setPlanId] = useState<PlanId>(initialPlan);
  const [methodId, setMethodId] = useState<PaymentMethodId>('kbzpay');
  const [transactionId, setTransactionId] = useState('');
  const [payerPhone, setPayerPhone] = useState('');
  const [errors, setErrors] = useState<{ transactionId?: string; payerPhone?: string }>({});
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Reset whenever the modal opens for a package
  useEffect(() => {
    if (packageId) {
      setPlanId(initialPlan);
      setMethodId('kbzpay');
      setTransactionId('');
      setPayerPhone('');
      setErrors({});
      setSubmitted(false);
    }
  }, [packageId, initialPlan]);

  useEffect(() => {
    if (!packageId) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [packageId, onClose]);

  if (!packageId) return null;

  const pkg = PREMIUM_PACKAGES[packageId];
  const plan = PRICING_PLANS[planId];
  const method = PAYMENT_METHODS.find(m => m.id === methodId)!;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(method.accountNumber.replace(/-/g, ''));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: the number is still visible to copy by hand
    }
  };

  const validate = () => {
    const next: typeof errors = {};
    if (transactionId.trim().length < 6) {
      next.transactionId = 'Enter the transaction ID from your payment receipt (at least 6 characters).';
    }
    if (!/^(\+?95|0)?9\d{7,10}$/.test(payerPhone.replace(/[\s-]/g, ''))) {
      next.payerPhone = 'Enter the phone number you paid from, e.g. 09 xxx xxx xxx.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      packageId,
      planId,
      methodId,
      transactionId: transactionId.trim(),
      payerPhone: payerPhone.trim(),
      status: 'pending',
      submittedAt: new Date().toISOString(),
      expiresAt: null
    });
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-5 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        onClick={e => e.stopPropagation()}
        className="relative w-full sm:max-w-lg max-h-[92dvh] overflow-y-auto bg-slate-900 border border-slate-700/60 rounded-t-3xl sm:rounded-3xl shadow-2xl text-slate-100"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 p-5 border-b border-slate-800 bg-slate-900/95 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/15 text-amber-400 flex items-center justify-center shrink-0">
              <Crown className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="checkout-title" className="text-lg font-black text-white leading-tight">{pkg.name}</h2>
              <p className="text-xs text-slate-400">{pkg.tagline}</p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="p-2.5 -m-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-6 text-center space-y-4" role="status">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-400/15 text-emerald-400 flex items-center justify-center">
              <Clock className="w-7 h-7" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-white">Payment submitted</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                We're checking your {method.name} transfer of <strong className="text-white">{formatKs(plan.priceKs)}</strong>.
                {' '}{pkg.name} unlocks as soon as it's confirmed, usually within 24 hours.
              </p>
            </div>
            <p className="text-xs text-slate-400 font-mono">Transaction ID: {transactionId.trim()}</p>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-sm transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="p-5 space-y-6">
            {/* Step 1: plan */}
            <fieldset className="space-y-2.5">
              <legend className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">1. Choose your plan</legend>
              {(Object.values(PRICING_PLANS)).map(p => {
                const selected = p.id === planId;
                return (
                  <label
                    key={p.id}
                    className={`flex items-center justify-between gap-3 p-4 rounded-2xl border cursor-pointer transition-colors ${
                      selected ? 'border-amber-400 bg-amber-400/10' : 'border-slate-700/60 bg-slate-800/40 hover:border-slate-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="plan"
                      value={p.id}
                      checked={selected}
                      onChange={() => setPlanId(p.id)}
                      className="sr-only"
                    />
                    <span className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          selected ? 'border-amber-400 bg-amber-400 text-slate-950' : 'border-slate-500'
                        }`}
                      >
                        {selected && <Check className="w-3 h-3" strokeWidth={3} />}
                      </span>
                      <span>
                        <span className="block text-sm font-bold text-white">{p.name}</span>
                        <span className="block text-xs text-slate-400">
                          {p.id === 'full' ? 'Pay once, keep access' : 'Renew each month, cancel anytime'}
                        </span>
                      </span>
                    </span>
                    <span className="text-right shrink-0">
                      <span className="block text-base font-black font-mono text-white">{formatKs(p.priceKs)}</span>
                      <span className="block text-xs text-slate-400">{p.billing}</span>
                    </span>
                  </label>
                );
              })}
            </fieldset>

            {/* Step 2: wallet */}
            <fieldset>
              <legend className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">2. Pay with</legend>
              <div className="grid grid-cols-2 gap-2">
                {PAYMENT_METHODS.map(m => {
                  const selected = m.id === methodId;
                  return (
                    <label
                      key={m.id}
                      className={`flex items-center gap-2 min-h-12 px-3 rounded-xl border cursor-pointer text-sm font-bold transition-colors ${
                        selected ? 'border-emerald-400 bg-emerald-400/10 text-white' : 'border-slate-700/60 bg-slate-800/40 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="method"
                        value={m.id}
                        checked={selected}
                        onChange={() => setMethodId(m.id)}
                        className="sr-only"
                      />
                      <Wallet className={`w-4 h-4 shrink-0 ${selected ? 'text-emerald-400' : 'text-slate-500'}`} aria-hidden="true" />
                      {m.name}
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {/* Step 3: transfer instructions */}
            <div className="space-y-2.5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">3. Transfer the amount</p>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm text-slate-300">Amount</span>
                  <span className="text-xl font-black font-mono text-amber-400">{formatKs(plan.priceKs)}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <span className="block text-xs text-slate-400">{method.name} · {method.accountName}</span>
                    <span className="block text-base font-bold font-mono text-white">{method.accountNumber}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors"
                  >
                    {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>

            {/* Step 4: proof of payment */}
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">4. Confirm your payment</p>
              <div className="space-y-1.5">
                <label htmlFor="txn-id" className="block text-sm font-semibold text-slate-200">
                  Transaction ID <span className="text-rose-400" aria-hidden="true">*</span>
                </label>
                <input
                  id="txn-id"
                  value={transactionId}
                  onChange={e => setTransactionId(e.target.value)}
                  onBlur={() => errors.transactionId && validate()}
                  autoComplete="off"
                  required
                  aria-invalid={!!errors.transactionId}
                  aria-describedby={errors.transactionId ? 'txn-id-error' : 'txn-id-help'}
                  className={`w-full min-h-12 px-4 rounded-xl bg-slate-800 border text-white font-mono text-base focus:outline-none focus:border-emerald-400 ${
                    errors.transactionId ? 'border-rose-500' : 'border-slate-700'
                  }`}
                />
                {errors.transactionId ? (
                  <p id="txn-id-error" role="alert" className="text-xs text-rose-400">{errors.transactionId}</p>
                ) : (
                  <p id="txn-id-help" className="text-xs text-slate-400">Shown on the {method.name} receipt after you transfer.</p>
                )}
              </div>
              <div className="space-y-1.5">
                <label htmlFor="payer-phone" className="block text-sm font-semibold text-slate-200">
                  Phone number you paid from <span className="text-rose-400" aria-hidden="true">*</span>
                </label>
                <input
                  id="payer-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="09 xxx xxx xxx"
                  value={payerPhone}
                  onChange={e => setPayerPhone(e.target.value)}
                  onBlur={() => errors.payerPhone && validate()}
                  required
                  aria-invalid={!!errors.payerPhone}
                  aria-describedby={errors.payerPhone ? 'payer-phone-error' : undefined}
                  className={`w-full min-h-12 px-4 rounded-xl bg-slate-800 border text-white font-mono text-base focus:outline-none focus:border-emerald-400 ${
                    errors.payerPhone ? 'border-rose-500' : 'border-slate-700'
                  }`}
                />
                {errors.payerPhone && (
                  <p id="payer-phone-error" role="alert" className="text-xs text-rose-400">{errors.payerPhone}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full min-h-12 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm transition-colors"
            >
              Submit payment · {formatKs(plan.priceKs)}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

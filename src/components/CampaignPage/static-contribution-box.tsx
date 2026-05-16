'use client';

import { useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { CustomButton } from '@/components/shared/custom-button';

export function StaticContributionBox({ 
  containerRef, 
  onContribute, 
  isConfirming,
  isMining,
  isSuccess,
  ethPrice,
  userBalance,
  remainingUSD
}: { 
  containerRef: React.RefObject<HTMLDivElement | null>,
  onContribute: (amount: string) => void,
  isConfirming: boolean,
  isMining: boolean,
  isSuccess: boolean,
  ethPrice: any,
  userBalance: any,
  remainingUSD: number
}) {
  const [amount, setAmount] = useState('');
  
  let ethEstimate = 0;
  let inrEstimate = 0;
  if (amount && ethPrice) {
    const usdVal = parseFloat(amount);
    ethEstimate = usdVal / ethPrice.usd;
    inrEstimate = usdVal * (ethPrice.inr / ethPrice.usd);
  }

  const isInsufficient = userBalance && parseFloat(userBalance.formatted) < ethEstimate;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    
    // Prevent more than 2 decimal places
    if (val.includes('.')) {
      const [int, dec] = val.split('.');
      if (dec && dec.length > 2) {
        val = `${int}.${dec.slice(0, 2)}`;
      }
    }

    if (parseFloat(val) > remainingUSD) {
      val = remainingUSD.toFixed(2);
    }
    setAmount(val);
  };

  return (
    <div ref={containerRef} className="p-5 md:p-8 bg-foreground rounded-2xl md:rounded-3xl text-white flex flex-col items-center gap-6 shadow-2xl ring-1 ring-white/10 scroll-mt-24">
      <div className="text-center w-full">
        <h3 className="text-base md:text-lg font-bold">Fund this Campaign</h3>
        <p className="text-xs md:text-sm text-white/60">Target remaining: ${remainingUSD.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</p>
      </div>
      
      {isSuccess ? (
        <div className="w-full flex items-center justify-center gap-3 bg-primary/20 px-6 py-4 rounded-2xl border border-primary/30 animate-in zoom-in-95">
          <CheckCircle2 className="h-6 w-6 text-primary" />
          <span className="text-base font-bold text-white">Contribution Successful!</span>
        </div>
      ) : (
        <div className="w-full flex flex-col gap-4">
          <div className="flex w-full items-center gap-3">
            <div className="relative flex-grow">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 font-bold text-sm">$</span>
              <Input 
                type="number" 
                placeholder="0.00"
                value={amount}
                onChange={handleAmountChange}
                disabled={isConfirming || isMining}
                className="bg-white/10 border-white/20 text-white pl-7 h-12 rounded-xl focus-visible:ring-primary focus-visible:border-primary text-base font-bold shadow-inner"
              />
            </div>
            <CustomButton 
              onClick={() => onContribute(amount)}
              isLoading={isConfirming || isMining}
              disabled={isInsufficient || !amount || parseFloat(amount) <= 0}
              className="h-12 px-8 rounded-xl font-black text-sm shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 min-w-[140px]"
            >
              {isConfirming ? 'Confirming...' : isMining ? 'Processing...' : 'Contribute'}
            </CustomButton>
          </div>
          
          {amount && ethPrice && (
            <div className="flex flex-col gap-1.5 px-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-white/60">
                  Estimated <span className="text-primary font-bold">{ethEstimate.toFixed(6)} ETH</span> | <span className="text-primary font-bold">₹{inrEstimate.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span>
                </div>
                {isInsufficient && (
                  <div className="flex items-center gap-1.5 text-xs text-destructive font-bold animate-pulse">
                    <AlertCircle className="h-4 w-4" />
                    Insufficient Balance
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

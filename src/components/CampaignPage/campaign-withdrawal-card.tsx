import { ExternalLink } from 'lucide-react';
import { MdVerifiedUser } from 'react-icons/md';
import { CustomButton } from '@/components/shared/custom-button';

interface CampaignWithdrawalCardProps {
  withdrawn: boolean;
  onWithdraw?: () => void;
  isLoading?: boolean;
  successTitle?: string;
  successMessage?: string;
}

export function CampaignWithdrawalCard({ 
  withdrawn,
  onWithdraw,
  isLoading = false,
  successTitle = "Funds Withdrawn",
  successMessage = "The raised amount has been successfully transferred to your wallet. Thank you for using the platform!"
}: CampaignWithdrawalCardProps) {
  
  if (withdrawn) {
    // Success state
    return (
      <div className="bg-emerald-50/50 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-emerald-200 p-5 md:p-8 shadow-xl flex flex-col gap-5">
        <div className="flex items-start gap-3">
          <div className="p-2 md:p-3 bg-emerald-100 rounded-xl md:rounded-2xl shrink-0">
            <MdVerifiedUser className="h-5 w-5 md:h-6 md:w-6 text-emerald-600" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-sm md:text-base font-black text-emerald-800">{successTitle}</h3>
            <p className="text-xs md:text-sm text-emerald-600/80 font-medium leading-relaxed">
              {successMessage}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Pending withdrawal state
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-primary/20 p-5 md:p-8 shadow-xl flex flex-col gap-5">
      <div className="flex items-start gap-3">
        <div className="p-2 md:p-3 bg-primary/10 rounded-xl md:rounded-2xl shrink-0">
          <ExternalLink className="h-5 w-5 md:h-6 md:w-6 text-primary" />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-sm md:text-base font-black text-foreground">Target Met</h3>
          <p className="text-xs md:text-sm text-muted-foreground font-medium leading-relaxed">
            Congratulations! Your campaign was successful. You can now withdraw the raised funds securely to your wallet.
          </p>
        </div>
      </div>
      <CustomButton 
        onClick={onWithdraw} 
        className="w-full h-12 md:h-14 rounded-xl md:rounded-2xl gap-2 font-black text-sm md:text-base shadow-xl shadow-primary/20" 
        isLoading={isLoading}
      >
        <ExternalLink size={20} /> Withdraw Funds
      </CustomButton>
    </div>
  );
}
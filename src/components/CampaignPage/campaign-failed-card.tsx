import { Info } from 'lucide-react';
import { Coins } from 'lucide-react';
import { CustomButton } from '@/components/shared/custom-button';

interface CampaignFailedCardProps {
  isOwner: boolean;
  hasContributed?: boolean;
  onClaimRefund?: () => void;
  isLoading?: boolean;
  ownerMessage?: string;
  contributorMessage?: string;
}

export function CampaignFailedCard({ 
  isOwner, 
  hasContributed = false,
  onClaimRefund,
  isLoading = false,
  ownerMessage = "Your campaign didn't quite reach its goal, but your effort made a difference! Refunds are being processed to all supporters. You can start a new campaign anytime.",
  contributorMessage = "The funding goal was not met by the deadline. If you contributed, you are eligible to claim a full refund."
}: CampaignFailedCardProps) {
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-destructive/20 p-5 md:p-8 shadow-xl flex flex-col gap-5">
      <div className="flex items-start gap-3">
        <div className="p-2 md:p-3 bg-destructive/10 rounded-xl md:rounded-2xl shrink-0">
          <Info className="h-5 w-5 md:h-6 md:w-6 text-destructive" />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-sm md:text-base font-black text-destructive">Campaign Failed</h3>
          <p className="text-xs md:text-sm text-destructive/80 font-medium leading-relaxed">
            {isOwner ? ownerMessage : contributorMessage}
          </p>
        </div>
      </div>
      {hasContributed && !isOwner && (
        <CustomButton 
          onClick={onClaimRefund} 
          variant="outline" 
          className="w-full h-12 md:h-14 rounded-xl md:rounded-2xl gap-2 text-destructive border-destructive/20 font-black text-sm md:text-base hover:bg-destructive/10 bg-white" 
          isLoading={isLoading}
        >
          <Coins size={20} /> Claim My Refund
        </CustomButton>
      )}
    </div>
  );
}
import { Info, Coins } from 'lucide-react';
import { MdVerifiedUser } from 'react-icons/md';
import { CustomButton } from '@/components/shared/custom-button';

interface CampaignFailedCardProps {
  isOwner: boolean;
  hasContributed?: boolean;
  onClaimRefund?: () => void;
  hasClaimedRefund?: boolean;
  isLoading?: boolean;
  ownerMessage?: string;
  contributorMessage?: string;
}

export function CampaignFailedCard({ 
  isOwner, 
  hasContributed = false,
  onClaimRefund,
  hasClaimedRefund = false,
  isLoading = false,
  ownerMessage = "Your campaign didn't quite reach its goal. Refunds are being processed to all supporters.",
  contributorMessage = "Unfortunately, this campaign didn't reach its funding goal. But don't worry, your money is safe and ready to be returned."
}: CampaignFailedCardProps) {

  if (hasClaimedRefund) {
    return (
      <div className="bg-emerald-50/50 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-emerald-200 p-5 md:p-8 shadow-xl flex flex-col gap-5">
        <div className="flex items-start gap-3">
          <div className="p-2 md:p-3 bg-emerald-100 rounded-xl md:rounded-2xl shrink-0">
            <MdVerifiedUser className="h-5 w-5 md:h-6 md:w-6 text-emerald-600" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-sm md:text-base font-black text-emerald-800">Refund Claimed</h3>
            <p className="text-xs md:text-sm text-emerald-600/80 font-medium leading-relaxed">
              Your contribution has been successfully returned to your wallet.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-[#27AE60]/20 p-5 md:p-8 shadow-xl flex flex-col gap-5">
      {!isOwner && (
        <div className="flex items-start gap-3">
          <div className="p-2 md:p-3 bg-[#27AE60]/10 rounded-xl md:rounded-2xl shrink-0">
            <Info className="h-5 w-5 md:h-6 md:w-6 text-[#27AE60]" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-sm md:text-base font-black text-[#27AE60]">Campaign Update</h3>
            <p className="text-xs md:text-sm text-[#27AE60]/70 font-medium leading-relaxed">
              {contributorMessage}
            </p>
          </div>
        </div>
      )}

      {isOwner && (
        <div className="flex items-start gap-3">
        <div className="p-2 md:p-3 bg-primary/10 rounded-xl md:rounded-2xl shrink-0">
          <Info className="h-5 w-5 md:h-6 md:w-6 text-primary" />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-sm md:text-base font-black text-primary">Campaign Update</h3>
          <p className="text-xs md:text-sm text-primary/70 font-medium leading-relaxed">
            {ownerMessage}
          </p>
        </div>
      </div>
      )}
      {hasContributed && !isOwner && (
        <CustomButton 
          onClick={onClaimRefund} 
          variant="default" 
          className="w-full h-12 md:h-14 rounded-xl md:rounded-2xl gap-2 text-white border-[#27AE60]/20 font-black text-sm md:text-base hover:bg-[#27AE60]/100 bg-[#27AE60]" 
          isLoading={isLoading}
        >
          <Coins size={20} /> Claim My Refund
        </CustomButton>
      )}
    </div>
  );
}
import { MdVerifiedUser } from 'react-icons/md';

interface WithdrawSuccessCardProps {
  title?: string;
  message?: string;
}

export function WithdrawSuccessCard({ 
  title = "Funds Withdrawn",
  message = "The raised amount has been successfully transferred to your wallet. Thank you for using the platform!"
}: WithdrawSuccessCardProps) {
  return (
    <div className="bg-emerald-50/50 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-emerald-200 p-5 md:p-8 shadow-xl flex flex-col gap-5">
      <div className="flex items-start gap-3">
        <div className="p-2 md:p-3 bg-emerald-100 rounded-xl md:rounded-2xl shrink-0">
          <MdVerifiedUser className="h-5 w-5 md:h-6 md:w-6 text-emerald-600" />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-sm md:text-base font-black text-emerald-800">{title}</h3>
          <p className="text-xs md:text-sm text-emerald-600/80 font-medium leading-relaxed">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
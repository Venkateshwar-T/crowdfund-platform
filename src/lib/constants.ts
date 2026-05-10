import { 
  Heart, 
  Sprout, 
  GraduationCap, 
  Cat, 
  Palette, 
  Cpu, 
  Trophy, 
  ShieldAlert, 
  Users 
} from 'lucide-react';
import { IoWoman } from "react-icons/io5";
import { GiProgression } from "react-icons/gi";

export const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1633078654544-61b94557a11f?q=80&w=2070&auto=format&fit=crop";

export const CAMPAIGN_CATEGORIES = [
  { id: 'medical', label: 'Medical', icon: Heart, color: 'bg-rose-500/10 text-rose-600 border-rose-200 hover:bg-rose-500/20' },
  { id: 'environment', label: 'Environment', icon: Sprout, color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200 hover:bg-emerald-500/20' },
  { id: 'education', label: 'Education', icon: GraduationCap, color: 'bg-blue-500/10 text-blue-600 border-blue-200 hover:bg-blue-500/20' },
  { id: 'animals', label: 'Animals', icon: Cat, color: 'bg-orange-500/10 text-orange-600 border-orange-200 hover:bg-orange-500/20' },
  { id: 'arts', label: 'Arts and Media', icon: Palette, color: 'bg-purple-500/10 text-purple-600 border-purple-200 hover:bg-purple-500/20' },
  { id: 'women', label: 'Women', icon: IoWoman, color: 'bg-pink-500/10 text-pink-600 border-pink-200 hover:bg-pink-500/20' },
  { id: 'community', label: 'Community', icon: Users, color: 'bg-indigo-500/10 text-indigo-600 border-indigo-200 hover:bg-indigo-500/20' },
  { id: 'technology', label: 'Technology', icon: Cpu, color: 'bg-slate-500/10 text-slate-600 border-slate-200 hover:bg-slate-500/20' },
  { id: 'sports', label: 'Sports', icon: Trophy, color: 'bg-yellow-500/10 text-yellow-600 border-yellow-200 hover:bg-yellow-500/20' },
  { id: 'disaster', label: 'Disaster Relief', icon: ShieldAlert, color: 'bg-red-500/10 text-red-600 border-red-200 hover:bg-red-500/20' },
  { id: 'development', label: 'Development', icon: GiProgression, color: 'bg-blue-500/10 text-blue-600 border-blue-200 hover:bg-blue-500/20' },
] as const;

export type CampaignStatus = 'Active' | 'Successful' | 'Failed';

export const STATUS_CONFIG = {
  Active: {
    className: "bg-white/80 text-primary border-primary/20",
    label: "Active"
  },
  Successful: {
    className: "bg-green-500/80 text-white",
    label: "Successful"
  },
  Failed: {
    className: "bg-red-500/80 text-white",
    label: "Failed"
  }
} as const;

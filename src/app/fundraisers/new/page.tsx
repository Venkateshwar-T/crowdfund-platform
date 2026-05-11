'use client';

import { useState, useEffect } from 'react';
import { X, Image as ImageIcon, CheckCircle2, ArrowLeft, PlusCircle, Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, Heading1 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { CustomButton } from '@/components/shared/custom-button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card } from '@/components/ui/card';
import { CustomDatePicker } from '@/components/shared/custom-date-picker';
import { useWriteContract, useAccount, useWaitForTransactionReceipt } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { parseUnits } from 'viem';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract';
import { useToast } from '@/hooks/use-toast';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import UnderlineExtension from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import { CAMPAIGN_CATEGORIES } from '@/lib/constants';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 5;

const formSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters').max(100),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  category: z.string().min(1, 'Please select a category'),
  otherCategory: z.string().optional(),
  targetAmount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Amount must be a positive number',
  }),
  deadline: z.date({
    required_error: 'A deadline is required',
  }).refine((date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  }, {
    message: "Deadline must be in the future",
  }),
  additionalNotes: z.string().optional(),
}).refine((data) => {
  if (data.category === 'other' && !data.otherCategory) {
    return false;
  }
  return true;
}, {
  message: "Please specify the other category name",
  path: ["otherCategory"],
});

type FormValues = z.infer<typeof formSchema>;

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;
  const buttons = [
    { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), active: 'bold' },
    { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), active: 'italic' },
    { icon: UnderlineIcon, action: () => editor.chain().focus().toggleUnderline().run(), active: 'underline' },
    { icon: Heading1, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: 'heading' },
    { icon: List, action: () => editor.chain().focus().toggleBulletList().run(), active: 'bulletList' },
    { icon: ListOrdered, action: () => editor.chain().focus().toggleOrderedList().run(), active: 'orderedList' },
  ];
  return (
    <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/30">
      {buttons.map((btn, i) => (
        <button key={i} type="button" onClick={btn.action} className={cn("p-2 rounded-lg transition-colors hover:bg-primary/10", editor.isActive(btn.active) ? "text-primary bg-primary/20" : "text-muted-foreground")}>
          <btn.icon size={18} />
        </button>
      ))}
    </div>
  );
};

const TiptapEditor = ({ value, onChange, placeholder }: { value: string, onChange: (val: string) => void, placeholder: string }) => {
  const editor = useEditor({
    extensions: [StarterKit, UnderlineExtension, Placeholder.configure({ placeholder })],
    content: value,
    onUpdate: ({ editor }) => { onChange(editor.getHTML()); },
    editorProps: { attributes: { class: 'prose prose-sm md:prose-base focus:outline-none min-h-[150px] p-4 max-w-none [overflow-wrap:break-word] [word-break:normal]' } },
  });
  return (
    <div className="w-full border rounded-xl overflow-hidden bg-background focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all border-muted-foreground/20">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default function NewFundraiserPage() {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { data: hash, writeContract, isPending: isWalletLoading } = useWriteContract();
  const { isLoading: isMining, isSuccess: isTransactionConfirmed } = useWaitForTransactionReceipt({ hash });
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: '', description: '', category: '', otherCategory: '', targetAmount: '', additionalNotes: '' },
  });

  const categoryValue = form.watch('category');

  useEffect(() => {
    if (isTransactionConfirmed) setShowSuccess(true);
  }, [isTransactionConfirmed]);

  useEffect(() => {
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
    return () => newPreviews.forEach(url => URL.revokeObjectURL(url));
  }, [files]);

  const addFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      if (!file.type.startsWith('image/')) return false;
      if (file.size > MAX_FILE_SIZE) return false;
      return true;
    });
    setFiles(prev => {
      const combined = [...prev, ...validFiles];
      return combined.slice(0, MAX_FILES);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files) addFiles(Array.from(e.target.files)); };
  const removeFile = (index: number) => setFiles(prev => prev.filter((_, i) => i !== index));

  const handleDrag = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragActive(e.type === "dragenter" || e.type === "dragover"); };
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); if (e.dataTransfer.files) addFiles(Array.from(e.dataTransfer.files)); };

  async function uploadToPinata(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}` },
      body: formData
    });
    const resData = await res.json();
    return `https://gateway.pinata.cloud/ipfs/${resData.IpfsHash}`;
  }

  async function onSubmit(values: FormValues) {
    if (!isConnected) {
      toast({ title: "Connect Wallet", description: "Please connect your wallet first to continue.", variant: "destructive" });
      openConnectModal?.();
      return;
    }
    if (files.length === 0) return toast({ title: "Media required", description: "Please upload at least one image.", variant: "destructive" });
    setIsUploading(true);
    try {
      const mediaUrls = await Promise.all(files.map(file => uploadToPinata(file)));
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'createCampaign',
        args: [
          values.title, 
          values.description, 
          values.additionalNotes || "", 
          values.category === 'other' ? values.otherCategory! : values.category, 
          mediaUrls, 
          parseUnits(parseFloat(values.targetAmount).toFixed(18), 18), 
          BigInt(Math.floor(values.deadline.getTime() / 1000))
        ],
      });
    } catch (error: any) { toast({ title: "Submission Failed", description: error.message, variant: "destructive" }); } finally { setIsUploading(false); }
  }

  if (showSuccess) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center">
      <div className="bg-emerald-100 p-6 rounded-full mb-6"><CheckCircle2 className="h-16 w-16 text-emerald-600 animate-in zoom-in duration-500" /></div>
      <h1 className="text-2xl md:text-4xl font-black text-foreground mb-2">Campaign Successfully Created!</h1>
      <p className="text-muted-foreground max-w-md mb-10">Your fundraiser is now live on the Sepolia Testnet.</p>
      <div className="flex flex-col md:flex-row gap-4 w-full max-w-md">
        <CustomButton asChild variant="outline" className="flex-1 h-12 rounded-2xl font-bold gap-2"><Link href="/"><ArrowLeft className="h-4 w-4" />Back to Home</Link></CustomButton>
        <CustomButton onClick={() => setShowSuccess(false)} className="flex-1 h-12 rounded-2xl font-bold gap-2"><PlusCircle className="h-4 w-4" />Create New Campaign</CustomButton>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      <main className="flex-grow py-6 md:py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-foreground">Launch a Fundraiser</h1>
          <p className="text-sm md:text-base tracking-wide text-muted-foreground mb-8">Decentralized fundraising. Real transparency. Powered by blockchain.</p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel className="text-sm md:text-base font-bold">Campaign Title <span className="text-destructive">*</span></FormLabel>
                <FormControl><Input placeholder="e.g. Help Sarah's Medical Recovery" className="h-10 md:h-12 rounded-xl" {...field} /></FormControl>
                <FormMessage /></FormItem>
              )} />
              
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel className="text-sm md:text-base font-bold">Description <span className="text-destructive">*</span></FormLabel>
                <FormControl><TiptapEditor value={field.value} onChange={field.onChange} placeholder="Tell your story here..." /></FormControl>
                <FormMessage /></FormItem>
              )} />

              <div className="space-y-4">
                <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm md:text-base font-bold">Select Category <span className="text-destructive">*</span></FormLabel>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-2">
                      {CAMPAIGN_CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        const isSelected = field.value === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => field.onChange(cat.id)}
                            className={cn(
                              "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2 text-center group",
                              isSelected 
                                ? "border-primary bg-primary/5 text-primary shadow-inner" 
                                : "border-muted-foreground/10 hover:border-primary/30 bg-background text-muted-foreground"
                            )}
                          >
                            <Icon className={cn("h-6 w-6 transition-transform group-active:scale-90", isSelected ? "text-primary" : "text-muted-foreground")} />
                            <span className="text-[10px] font-bold uppercase tracking-tight leading-tight">{cat.label}</span>
                          </button>
                        );
                      })}
                      <button
                        type="button"
                        onClick={() => field.onChange('other')}
                        className={cn(
                          "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2 text-center group",
                          field.value === 'other'
                            ? "border-primary bg-primary/5 text-primary shadow-inner" 
                            : "border-muted-foreground/10 hover:border-primary/30 bg-background text-muted-foreground"
                        )}
                      >
                        <PlusCircle className={cn("h-6 w-6 transition-transform group-active:scale-90", field.value === 'other' ? "text-primary" : "text-muted-foreground")} />
                        <span className="text-[10px] font-bold uppercase tracking-tight">Other</span>
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )} />

                {categoryValue === 'other' && (
                  <FormField control={form.control} name="otherCategory" render={({ field }) => (
                    <FormItem className="animate-in fade-in slide-in-from-top-2 duration-300">
                      <FormLabel className="text-sm md:text-base font-bold">Specify Category Name <span className="text-destructive">*</span></FormLabel>
                      <FormControl><Input placeholder="e.g. Wildlife Preservation" className="h-10 md:h-12 rounded-xl" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                )}
              </div>

              <Card className="p-4 md:p-6 border-muted-foreground/10 bg-primary/5 rounded-3xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <FormField control={form.control} name="targetAmount" render={({ field }) => (
                    <FormItem><FormLabel className="text-sm md:text-base font-bold">Target Amount (USD) <span className="text-destructive">*</span></FormLabel>
                    <FormControl><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm">$</span><Input type="number" step="0.01" className="h-10 md:h-12 pl-7 rounded-xl" {...field} /></div></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="deadline" render={({ field }) => (
                    <FormItem className="flex flex-col gap-1.5"><FormLabel className="text-sm md:text-base font-bold">Deadline Date <span className="text-destructive">*</span></FormLabel>
                    <FormControl><CustomDatePicker value={field.value} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
              </Card>

              <div className="space-y-4">
                <FormLabel className="text-sm md:text-base font-bold">Image Upload (Max 5) <span className="text-destructive">*</span></FormLabel>
                <div className={cn("relative border-2 border-dashed rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors", dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-primary/50")} onDragOver={handleDrag} onDrop={handleDrop} onClick={() => document.getElementById('file-upload')?.click()}>
                  <input id="file-upload" type="file" className="hidden" multiple accept="image/*" onChange={handleFileChange} />
                  <ImageIcon className="h-8 w-8 text-primary" /><p className="text-xs font-bold">Click or drag & drop</p>
                </div>
                {files.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {files.map((_, i) => (
                      <div key={i} className="relative aspect-square rounded-xl overflow-hidden border">
                        <img src={previews[i]} className="object-cover w-full h-full" alt="preview" />
                        <button type="button" onClick={(e) => { e.stopPropagation(); removeFile(i); }} className="absolute top-1 right-1 bg-destructive text-white p-1 rounded-full shadow-lg">
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <FormField control={form.control} name="additionalNotes" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm md:text-base font-bold">Additional Notes (Optional)</FormLabel>
                  <FormControl>
                    <TiptapEditor value={field.value || ""} onChange={field.onChange} placeholder="Any extra information for your supporters..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <CustomButton type="submit" className="w-full h-12 md:h-14 rounded-full font-bold text-base md:text-lg" isLoading={isUploading || isWalletLoading || isMining}>Create Campaign</CustomButton>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
}

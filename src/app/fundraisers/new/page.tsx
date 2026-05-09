'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, X, Film, Image as ImageIcon, CheckCircle2, ArrowLeft, PlusCircle, Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, Heading1 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { CustomButton } from '@/components/custom-button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { CustomDatePicker } from '@/components/custom-date-picker';
import { useWriteContract, useAccount, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract';
import { useToast } from '@/hooks/use-toast';
import { useEthPrice } from '@/hooks/use-eth-price';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import UnderlineExtension from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
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

const PREDEFINED_CATEGORIES = [
  { id: 'medical', label: 'Medical' },
  { id: 'environment', label: 'Environment' },
  { id: 'education', label: 'Education' },
  { id: 'animals', label: 'Animals' },
  { id: 'arts', label: 'Arts and Media' },
  { id: 'women', label: 'Women' },
  { id: 'elderly', label: 'Elderly' },
  { id: 'technology', label: 'Technology' },
  { id: 'sports', label: 'Sports' },
  { id: 'disaster', label: 'Disaster Relief' },
  { id: 'development', label: 'Development' },
  { id: 'other', label: 'Other' },
];

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
        <button
          key={i}
          type="button"
          onClick={btn.action}
          className={cn(
            "p-2 rounded-lg transition-colors hover:bg-primary/10",
            editor.isActive(btn.active) ? "text-primary bg-primary/20" : "text-muted-foreground"
          )}
        >
          <btn.icon size={18} />
        </button>
      ))}
    </div>
  );
};

const TiptapEditor = ({ value, onChange, placeholder }: { value: string, onChange: (val: string) => void, placeholder: string }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      UnderlineExtension,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm md:prose-base focus:outline-none min-h-[150px] p-4 max-w-none [overflow-wrap:break-word] [word-break:normal]',
      },
    },
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
  const { data: hash, writeContract, isPending: isWalletLoading } = useWriteContract();
  const { isLoading: isMining, isSuccess: isTransactionConfirmed } = useWaitForTransactionReceipt({ hash });
  const { prices } = useEthPrice();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      otherCategory: '',
      targetAmount: '',
      additionalNotes: '',
    },
  });

  const categoryValue = form.watch('category');

  useEffect(() => {
    if (isTransactionConfirmed) {
      setShowSuccess(true);
    }
  }, [isTransactionConfirmed]);

  useEffect(() => {
    const newPreviews = files.map(file => {
      if (file.type.startsWith('image/')) {
        return URL.createObjectURL(file);
      }
      return '';
    });
    setPreviews(newPreviews);

    return () => {
      newPreviews.forEach(url => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [files]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      addFiles(newFiles);
    }
  };

  const addFiles = (newFiles: File[]) => {
    const videoCount = files.filter(f => f.type.startsWith('video/')).length;
    const newVideoCount = newFiles.filter(f => f.type.startsWith('video/')).length;

    if (videoCount + newVideoCount > 1) {
      toast({
        title: "Too many videos",
        description: "Only 1 video allowed per campaign.",
        variant: "destructive"
      });
      return;
    }

    const validFiles = newFiles.filter(file => {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: `File ${file.name} exceeds 10MB limit.`,
          variant: "destructive"
        });
        return false;
      }
      return true;
    });

    setFiles(prev => {
      const combined = [...prev, ...validFiles];
      if (combined.length > MAX_FILES) {
        toast({
          title: "Too many files",
          description: `Max ${MAX_FILES} files allowed.`,
          variant: "destructive"
        });
        return combined.slice(0, MAX_FILES);
      }
      return combined;
    });
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  async function uploadToPinata(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const pinataMetadata = JSON.stringify({ name: file.name });
    formData.append('pinataMetadata', pinataMetadata);
    const pinataOptions = JSON.stringify({ cidVersion: 0 });
    formData.append('pinataOptions', pinataOptions);

    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`
      },
      body: formData
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.error || 'Upload failed');
    return `https://gateway.pinata.cloud/ipfs/${resData.IpfsHash}`;
  }

  async function onSubmit(values: FormValues) {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a campaign.",
        variant: "destructive"
      });
      return;
    }

    if (files.length === 0) {
      toast({
        title: "Media required",
        description: "Please upload at least one image or video.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    try {
      const mediaUrls = await Promise.all(files.map(file => uploadToPinata(file)));
      const usdAmount = parseFloat(values.targetAmount);
      const targetInUSD = parseUnits(usdAmount.toFixed(18), 18);

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
          targetInUSD,
          BigInt(Math.floor(values.deadline.getTime() / 1000)),
        ]
      }, {
        onSuccess: () => {
          toast({
            title: "Transaction Sent",
            description: "Your campaign is being created on the blockchain.",
          });
        },
        onError: (error) => {
          toast({
            title: "Contract Error",
            description: error.message,
            variant: "destructive"
          });
        }
      });
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  }

  const resetPage = () => {
    form.reset();
    setFiles([]);
    setPreviews([]);
    setShowSuccess(false);
  };

  const isSubmitting = isUploading || isWalletLoading || isMining;

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center">
        <div className="bg-emerald-100 p-6 rounded-full mb-6">
          <CheckCircle2 className="h-16 w-16 text-emerald-600 animate-in zoom-in duration-500" />
        </div>
        <h1 className="text-2xl md:text-4xl font-black text-foreground mb-2">Campaign Successfully Created!</h1>
        <p className="text-muted-foreground max-w-md mb-10">
          Your fundraiser is now live on the Sepolia Testnet. You can now start sharing it with your community.
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 w-full max-w-md">
          <CustomButton asChild variant="outline" className="flex-1 h-12 rounded-2xl font-bold gap-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </CustomButton>
          <CustomButton onClick={resetPage} className="flex-1 h-12 rounded-2xl font-bold gap-2">
            <PlusCircle className="h-4 w-4" />
            Create New Campaign
          </CustomButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      <main className="flex-grow py-6 md:py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-foreground">Launch a Fundraiser</h1>
            <p className="text-muted-foreground mt-2">Fill out the details below to start your on-chain journey.</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
              
              <div className="space-y-4 md:space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm md:text-base font-bold">
                        Campaign Title <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. Help Sarah's Medical Recovery" 
                          className="h-10 md:h-12 text-sm md:text-base rounded-xl border-muted-foreground/20 transition-all focus-visible:ring-primary/20"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription className="text-xs md:text-sm">Make it catchy and clear about the cause.</FormDescription>
                      <FormMessage className="text-xs md:text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm md:text-base font-bold">
                        Description <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <TiptapEditor 
                          value={field.value} 
                          onChange={field.onChange} 
                          placeholder="Tell your story here..." 
                        />
                      </FormControl>
                      <FormMessage className="text-xs md:text-sm" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm md:text-base font-bold">
                          Category <span className="text-destructive">*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-10 md:h-12 text-sm md:text-base rounded-xl border-muted-foreground/20 focus:ring-primary/20">
                              <SelectValue placeholder="Select a domain" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xl">
                            {PREDEFINED_CATEGORIES.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id}>
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-xs md:text-sm" />
                      </FormItem>
                    )}
                  />

                  {categoryValue === 'other' && (
                    <FormField
                      control={form.control}
                      name="otherCategory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm md:text-base font-bold">Category Name <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Specify domain" 
                              className="h-10 md:h-12 text-sm md:text-base rounded-xl border-muted-foreground/20 focus-visible:ring-primary/20"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-xs md:text-sm" />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>

              <Card className="p-4 md:p-6 border-muted-foreground/10 bg-primary/5 rounded-3xl overflow-visible">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-3 md:space-y-4">
                    <FormLabel className="text-sm md:text-base font-bold">
                      Target Amount (USD) <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormField
                      control={form.control}
                      name="targetAmount"
                      render={({ field }) => (
                        <FormItem className="flex-grow">
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm">$</span>
                              <Input 
                                type="number"
                                step="0.01"
                                placeholder="0.00" 
                                className="h-10 md:h-12 pl-7 text-sm md:text-base rounded-xl border-muted-foreground/20 transition-all bg-background focus-visible:ring-primary/20"
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs md:text-sm" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="deadline"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-1.5">
                        <FormLabel className="text-sm md:text-base font-bold">
                          Deadline Date <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <CustomDatePicker 
                            value={field.value} 
                            onChange={field.onChange}
                            placeholder="Select end date"
                          />
                        </FormControl>
                        <FormMessage className="text-xs md:text-sm" />
                      </FormItem>
                    )}
                  />
                </div>
              </Card>

              <div className="space-y-3 md:space-y-4">
                <FormLabel className="text-sm md:text-base font-bold">
                  Media Upload (Max 5 files, 1 video) <span className="text-destructive">*</span>
                </FormLabel>
                <div 
                  className={cn(
                    "relative border-2 border-dashed rounded-3xl p-6 md:p-8 transition-all duration-200 flex flex-col items-center justify-center gap-3 md:gap-4 cursor-pointer",
                    dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5",
                    files.length >= MAX_FILES && "opacity-50 pointer-events-none"
                  )}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <input 
                    id="file-upload"
                    type="file" 
                    className="hidden" 
                    multiple 
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    disabled={files.length >= MAX_FILES}
                  />
                  <div className="h-12 w-12 md:h-16 md:w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Upload className="h-6 w-6 md:h-8 md:w-8" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs md:text-sm font-bold">Click or drag & drop</p>
                    <p className="text-[10px] md:text-xs text-muted-foreground mt-1">Up to 5 files, Max 1 video (10MB each)</p>
                  </div>
                </div>

                {files.length > 0 && (
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
                    {files.map((file, i) => {
                      const isImage = file.type.startsWith('image/');
                      return (
                        <div key={i} className="group relative aspect-square rounded-2xl bg-muted border overflow-hidden">
                          {isImage && previews[i] ? (
                            <img src={previews[i]} alt="Preview" className="h-full w-full object-cover" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                              {file.type.startsWith('video/') ? <Film className="h-5 w-5 md:h-6 md:w-6" /> : <ImageIcon className="h-5 w-5 md:h-6 md:w-6" />}
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2">
                            <p className="text-[8px] md:text-[10px] text-white font-medium truncate w-full text-center mb-1 md:mb-2">{file.name}</p>
                            <button 
                              type="button"
                              onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                              className="bg-destructive text-destructive-foreground p-1 rounded-full hover:scale-110 transition-transform"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <FormField
                control={form.control}
                name="additionalNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm md:text-base font-bold">
                      Additional Notes <span className="text-muted-foreground font-normal ml-1">(Optional)</span>
                    </FormLabel>
                    <FormControl>
                      <TiptapEditor 
                        value={field.value || ''} 
                        onChange={field.onChange} 
                        placeholder="Any extra info for your donors..." 
                      />
                    </FormControl>
                    <FormMessage className="text-xs md:text-sm" />
                  </FormItem>
                )}
              />

              <div className="pt-6 md:pt-8 flex flex-col gap-3 md:gap-4">
                <CustomButton 
                  type="submit" 
                  className="w-full h-10 md:h-14 text-sm md:text-lg font-bold rounded-full shadow-lg hover:shadow-primary/20"
                  isLoading={isSubmitting}
                >
                  {isSubmitting ? (
                    isUploading ? 'Uploading to IPFS...' : isMining ? 'Mining Transaction...' : 'Creating Campaign...'
                  ) : (
                    'Create Campaign'
                  )}
                </CustomButton>
                <p className="text-center text-[10px] md:text-xs text-muted-foreground">
                  By creating a campaign, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>

            </form>
          </Form>
        </div>
      </main>
    </div>
  );
}
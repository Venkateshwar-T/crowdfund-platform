'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, X, Calendar as CalendarIcon, Loader2, Film, Image as ImageIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';

import { cn } from '@/lib/utils';
import { CustomButton } from '@/components/custom-button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';

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
  currency: z.enum(['INR', 'USD']),
  deadline: z.date({
    required_error: 'A deadline is required',
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
  { id: 'development', label: 'Urban/Rural Development' },
  { id: 'other', label: 'Other' },
];

export default function NewFundraiserPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      otherCategory: '',
      targetAmount: '',
      currency: 'INR',
      additionalNotes: '',
    },
  });

  const categoryValue = form.watch('category');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      addFiles(newFiles);
    }
  };

  const addFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      if (file.size > MAX_FILE_SIZE) {
        alert(`File ${file.name} is too large. Max size is 10MB.`);
        return false;
      }
      return true;
    });

    setFiles(prev => {
      const combined = [...prev, ...validFiles];
      if (combined.length > MAX_FILES) {
        alert(`You can only upload up to ${MAX_FILES} files.`);
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

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    // Simulate API call
    console.log(values, files);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/browse');
    }, 2000);
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 h-14 md:h-16 flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-accent rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </button>
          <h1 className="text-lg font-bold tracking-tight">Create New Campaign</h1>
        </div>
      </header>

      <main className="flex-grow py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Basic Information */}
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-bold">Campaign Title</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. Help Sarah's Medical Recovery" 
                          className="h-12 text-base rounded-xl border-muted-foreground/20 focus:border-primary transition-all"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>Make it catchy and clear about the cause.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-bold">Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell your story. What happened? Why do you need help? How will the funds be used?" 
                          className="min-h-[150px] text-base rounded-xl border-muted-foreground/20 focus:border-primary transition-all resize-none"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-bold">Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 rounded-xl border-muted-foreground/20">
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {categoryValue === 'other' && (
                    <FormField
                      control={form.control}
                      name="otherCategory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-bold">Category Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Specify domain" 
                              className="h-12 rounded-xl border-muted-foreground/20"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>

              {/* Financials & Timeline */}
              <Card className="p-6 border-muted-foreground/10 bg-primary/5 rounded-3xl overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <FormLabel className="text-base font-bold">Target Amount</FormLabel>
                    <div className="flex gap-2">
                      <FormField
                        control={form.control}
                        name="currency"
                        render={({ field }) => (
                          <FormItem className="w-1/3">
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 rounded-xl border-muted-foreground/20 bg-background">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="rounded-xl">
                                <SelectItem value="INR">INR (₹)</SelectItem>
                                <SelectItem value="USD">USD ($)</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="targetAmount"
                        render={({ field }) => (
                          <FormItem className="flex-grow">
                            <FormControl>
                              <Input 
                                type="number"
                                placeholder="0.00" 
                                className="h-12 text-base rounded-xl border-muted-foreground/20 focus:border-primary transition-all bg-background"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="deadline"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-1.5">
                        <FormLabel className="text-base font-bold">Deadline Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <CustomButton
                                variant={"outline"}
                                className={cn(
                                  "h-12 w-full pl-4 text-left font-medium rounded-xl border-muted-foreground/20 bg-background hover:bg-background hover:border-primary/50 transition-all",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Select campaign end date</span>
                                )}
                                <CalendarIcon className="ml-auto h-5 w-5 text-primary opacity-70" />
                              </CustomButton>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 rounded-2xl shadow-2xl border-none overflow-hidden" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date()
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Card>

              {/* Media Upload */}
              <div className="space-y-4">
                <FormLabel className="text-base font-bold">Media Uploads (Max 5)</FormLabel>
                <div 
                  className={cn(
                    "relative border-2 border-dashed rounded-3xl p-8 transition-all duration-200 flex flex-col items-center justify-center gap-4 cursor-pointer",
                    dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5",
                    files.length >= MAX_FILES && "opacity-50 pointer-events-none"
                  )}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
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
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Upload className="h-8 w-8" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold">Click or drag & drop</p>
                    <p className="text-xs text-muted-foreground mt-1">Images or videos up to 10MB each</p>
                  </div>
                </div>

                {/* File Previews */}
                {files.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {files.map((file, i) => (
                      <div key={i} className="group relative aspect-square rounded-2xl bg-muted border overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                          {file.type.startsWith('video/') ? <Film className="h-6 w-6" /> : <ImageIcon className="h-6 w-6" />}
                        </div>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2">
                          <p className="text-[10px] text-white font-medium truncate w-full text-center mb-2">{file.name}</p>
                          <button 
                            type="button"
                            onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                            className="bg-destructive text-destructive-foreground p-1 rounded-full hover:scale-110 transition-transform"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Additional Notes */}
              <FormField
                control={form.control}
                name="additionalNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold">Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any extra details or messages for your supporters?" 
                        className="min-h-[100px] text-base rounded-xl border-muted-foreground/20 focus:border-primary transition-all resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Section */}
              <div className="pt-8 flex flex-col gap-4">
                <CustomButton 
                  type="submit" 
                  className="w-full h-14 text-lg font-bold rounded-full shadow-lg hover:shadow-primary/20"
                  isLoading={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating Campaign...
                    </>
                  ) : (
                    'Create Campaign'
                  )}
                </CustomButton>
                <p className="text-center text-xs text-muted-foreground">
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

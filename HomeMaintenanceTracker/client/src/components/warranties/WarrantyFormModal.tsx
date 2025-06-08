import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription,
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCategories } from "@/hooks/useCategories";
import { apiRequest } from "@/lib/queryClient";
import { Warranty } from "@/types";
import { Save, Plus, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

interface WarrantyFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  warranty: Warranty | null;
}

const warrantyFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  location: z.string().optional(),
  expirationDate: z.date({
    required_error: "Expiration date is required",
  }),
  categoryId: z.string().optional().transform(val => val ? parseInt(val) : null),
});

type WarrantyFormValues = z.infer<typeof warrantyFormSchema>;

export function WarrantyFormModal({ open, onOpenChange, warranty }: WarrantyFormModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { categories } = useCategories();
  
  const defaultValues: Partial<WarrantyFormValues> = {
    title: warranty?.title || "",
    description: warranty?.description || "",
    location: warranty?.location || "",
    expirationDate: warranty?.expirationDate ? new Date(warranty.expirationDate) : undefined,
    categoryId: warranty?.categoryId ? String(warranty.categoryId) : undefined,
  };
  
  const form = useForm<WarrantyFormValues>({
    resolver: zodResolver(warrantyFormSchema),
    defaultValues,
  });
  
  // Reset form when warranty changes
  React.useEffect(() => {
    if (open) {
      form.reset({
        title: warranty?.title || "",
        description: warranty?.description || "",
        location: warranty?.location || "",
        expirationDate: warranty?.expirationDate ? new Date(warranty.expirationDate) : undefined,
        categoryId: warranty?.categoryId ? String(warranty.categoryId) : undefined,
      });
    }
  }, [form, warranty, open]);
  
  const createMutation = useMutation({
    mutationFn: async (values: WarrantyFormValues) => {
      const response = await apiRequest("POST", "/api/warranties", values);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Warranty created successfully",
        description: "Your warranty has been saved",
      });
      form.reset();
      onOpenChange(false);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['/api/warranties'] });
      queryClient.invalidateQueries({ queryKey: ['/api/warranties/upcoming'] });
    },
    onError: (error) => {
      toast({
        title: "Failed to create warranty",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  });
  
  const updateMutation = useMutation({
    mutationFn: async (values: WarrantyFormValues) => {
      if (!warranty) throw new Error("Warranty not found");
      const response = await apiRequest("PUT", `/api/warranties/${warranty.id}`, values);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Warranty updated successfully",
        description: "Your changes have been saved",
      });
      form.reset();
      onOpenChange(false);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['/api/warranties'] });
      queryClient.invalidateQueries({ queryKey: ['/api/warranties/upcoming'] });
    },
    onError: (error) => {
      toast({
        title: "Failed to update warranty",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  });
  
  const onSubmit = (values: WarrantyFormValues) => {
    if (warranty) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
  };
  
  const isPending = createMutation.isPending || updateMutation.isPending;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{warranty ? "Edit Warranty" : "Add New Warranty"}</DialogTitle>
          <DialogDescription>
            {warranty ? "Update warranty details" : "Add a new warranty or expiration date"}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Water Filter" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add any relevant details" 
                      className="resize-none" 
                      {...field} 
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Kitchen Sink" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="expirationDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Expiration Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={`w-full pl-3 text-left font-normal ${
                            !field.value && "text-muted-foreground"
                          }`}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <Calendar className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category (Optional)</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value?.toString()} 
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isPending}
                className="flex items-center"
              >
                {isPending ? (
                  "Saving..."
                ) : (
                  <>
                    {warranty ? <Save className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                    {warranty ? "Save Changes" : "Add Warranty"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

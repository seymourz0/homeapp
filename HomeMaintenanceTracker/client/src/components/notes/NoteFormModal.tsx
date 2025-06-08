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
import { Note } from "@/types";
import { Save, Plus } from "lucide-react";

interface NoteFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note: Note | null;
}

const noteFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  categoryId: z.string().optional().transform(val => val ? parseInt(val) : null),
});

type NoteFormValues = z.infer<typeof noteFormSchema>;

export function NoteFormModal({ open, onOpenChange, note }: NoteFormModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { categories } = useCategories();
  
  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      title: note?.title || "",
      content: note?.content || "",
      categoryId: note?.categoryId ? String(note.categoryId) : undefined,
    },
  });
  
  // Reset form when note changes
  React.useEffect(() => {
    if (open) {
      form.reset({
        title: note?.title || "",
        content: note?.content || "",
        categoryId: note?.categoryId ? String(note.categoryId) : undefined,
      });
    }
  }, [form, note, open]);
  
  const createMutation = useMutation({
    mutationFn: async (values: NoteFormValues) => {
      const response = await apiRequest("POST", "/api/notes", values);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Note created successfully",
        description: "Your note has been saved",
      });
      form.reset();
      onOpenChange(false);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['/api/notes'] });
      queryClient.invalidateQueries({ queryKey: ['/api/notes/recent'] });
    },
    onError: (error) => {
      toast({
        title: "Failed to create note",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  });
  
  const updateMutation = useMutation({
    mutationFn: async (values: NoteFormValues) => {
      if (!note) throw new Error("Note not found");
      const response = await apiRequest("PUT", `/api/notes/${note.id}`, values);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Note updated successfully",
        description: "Your changes have been saved",
      });
      form.reset();
      onOpenChange(false);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['/api/notes'] });
      queryClient.invalidateQueries({ queryKey: ['/api/notes/recent'] });
    },
    onError: (error) => {
      toast({
        title: "Failed to update note",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  });
  
  const onSubmit = (values: NoteFormValues) => {
    if (note) {
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
          <DialogTitle>{note ? "Edit Note" : "Add New Note"}</DialogTitle>
          <DialogDescription>
            {note ? "Update your maintenance note" : "Create a new maintenance note"}
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
                    <Input placeholder="e.g. HVAC Filter Replacement" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add maintenance details" 
                      className="min-h-[120px]" 
                      {...field} 
                    />
                  </FormControl>
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
                    {note ? <Save className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                    {note ? "Save Changes" : "Add Note"}
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

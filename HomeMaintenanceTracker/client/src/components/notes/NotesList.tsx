import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "@/lib/utils";
import { CategoryBadge } from "@/components/common/CategoryBadge";
import { type Note } from "@/types";
import { Clock, PlusCircle, Edit, Trash } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/useCategories";
import { NoteFormModal } from "./NoteFormModal";

export function NotesList() {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const { categories } = useCategories();
  
  const { data: notes, isLoading } = useQuery<Note[]>({
    queryKey: ['/api/notes', activeCategory ? { categoryId: activeCategory } : undefined],
  });

  const handleAddNote = () => {
    setSelectedNote(null);
    setIsFormModalOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setIsFormModalOpen(true);
  };

  const handleCategoryFilter = (categoryId: number | null) => {
    setActiveCategory(categoryId);
  };

  if (isLoading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-secondary-900">Maintenance Notes</h2>
          <Button onClick={handleAddNote} className="flex items-center">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Note
          </Button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-wrap gap-4 mb-4">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
          
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <Skeleton className="h-5 w-40 mb-1" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-3/4 mb-3" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
        
        <NoteFormModal 
          open={isFormModalOpen} 
          onOpenChange={setIsFormModalOpen} 
          note={selectedNote}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-secondary-900">Maintenance Notes</h2>
        <Button onClick={handleAddNote} className="flex items-center">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Note
        </Button>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-wrap gap-4 mb-4">
          <Button 
            variant={activeCategory === null ? "default" : "outline"}
            onClick={() => handleCategoryFilter(null)}
            className="px-3 py-1 h-auto"
          >
            All Notes
          </Button>
          
          {categories.map(category => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              onClick={() => handleCategoryFilter(category.id)}
              className="px-3 py-1 h-auto"
            >
              {category.name}
            </Button>
          ))}
        </div>
        
        {!notes || notes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-secondary-600 mb-4">No notes found. Add your first maintenance note.</p>
            <Button onClick={handleAddNote} className="flex items-center mx-auto">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Note
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {notes.map(note => (
              <div key={note.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-secondary-900">{note.title}</h3>
                  <div className="flex items-center space-x-2">
                    <CategoryBadge categoryId={note.categoryId} />
                    <div className="flex">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 rounded-full"
                        onClick={() => handleEditNote(note)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 rounded-full text-red-500 hover:text-red-600"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-secondary-600 mb-3 whitespace-pre-line">{note.content}</p>
                <div className="text-xs text-secondary-500 flex items-center">
                  <Clock className="mr-1 h-3 w-3" />
                  {formatDate(note.createdAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <NoteFormModal 
        open={isFormModalOpen} 
        onOpenChange={setIsFormModalOpen} 
        note={selectedNote}
      />
    </div>
  );
}

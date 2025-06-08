import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Photo } from "@/types";
import { Eye, Download, Trash, Upload } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/useCategories";
import { PhotoUploadModal } from "./PhotoUploadModal";

export function PhotoGallery() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const { categories } = useCategories();
  
  const { data: photos, isLoading } = useQuery<Photo[]>({
    queryKey: ['/api/photos', activeCategory ? { categoryId: activeCategory } : undefined],
  });

  const handleCategoryFilter = (categoryId: number | null) => {
    setActiveCategory(categoryId);
  };

  if (isLoading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-secondary-900">Photos Gallery</h2>
          <Button onClick={() => setIsUploadModalOpen(true)} className="flex items-center">
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-wrap gap-4 mb-4">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton key={i} className="h-32 sm:h-40 rounded-lg" />
            ))}
          </div>
        </div>
        
        <PhotoUploadModal open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-secondary-900">Photos Gallery</h2>
        <Button onClick={() => setIsUploadModalOpen(true)} className="flex items-center">
          <Upload className="mr-2 h-4 w-4" />
          Upload
        </Button>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-wrap gap-4 mb-4">
          <Button 
            variant={activeCategory === null ? "default" : "outline"}
            onClick={() => handleCategoryFilter(null)}
            className="px-3 py-1 h-auto"
          >
            All Photos
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
        
        {!photos || photos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-secondary-600 mb-4">No photos found.</p>
            <Button onClick={() => setIsUploadModalOpen(true)}>
              Upload your first photo
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {photos.map(photo => (
              <div key={photo.id} className="relative rounded-lg overflow-hidden group cursor-pointer">
                <img 
                  src={`/api/photos/${photo.id}/file`} 
                  alt={photo.title} 
                  className="w-full h-32 sm:h-40 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Link href={`/photos/${photo.id}`}>
                    <Button variant="ghost" size="icon" className="rounded-full bg-white text-secondary-800 mr-2 h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <a href={`/api/photos/${photo.id}/file`} download={`${photo.title}.${photo.filePath.split('.').pop()}`}>
                    <Button variant="ghost" size="icon" className="rounded-full bg-white text-secondary-800 mr-2 h-8 w-8">
                      <Download className="h-4 w-4" />
                    </Button>
                  </a>
                  <Button variant="ghost" size="icon" className="rounded-full bg-white text-secondary-800 h-8 w-8">
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-60">
                  <h3 className="text-white text-xs font-medium">{photo.title}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <PhotoUploadModal open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen} />
    </div>
  );
}

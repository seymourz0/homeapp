import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { formatDate } from "@/lib/utils";
import { type Photo } from "@/types";
import { Eye, Download } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export function RecentPhotos() {
  const { data, isLoading } = useQuery<Photo[]>({
    queryKey: ['/api/photos/recent'],
  });

  if (isLoading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-secondary-900">Recent Photos</h2>
          <Link href="/photos">
            <a className="text-sm text-primary-600 hover:text-primary-700 font-medium">View All</a>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <Skeleton className="w-full h-40" />
              <div className="p-3">
                <Skeleton className="h-5 w-24 mb-1" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Handle when no data
  if (!data || data.length === 0) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-secondary-900">Recent Photos</h2>
          <Link href="/photos">
            <a className="text-sm text-primary-600 hover:text-primary-700 font-medium">View All</a>
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-secondary-600">No photos uploaded yet.</p>
          <Link href="/photos">
            <Button variant="link" className="mt-2">
              Upload your first photo
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-secondary-900">Recent Photos</h2>
        <Link href="/photos">
          <a className="text-sm text-primary-600 hover:text-primary-700 font-medium">View All</a>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {data.map((photo) => (
          <div key={photo.id} className="relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group">
            <img 
              src={`/api/photos/${photo.id}/file`} 
              alt={photo.title} 
              className="w-full h-40 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Link href={`/photos/${photo.id}`}>
                <Button variant="ghost" size="icon" className="rounded-full bg-white text-secondary-800 mr-2 h-8 w-8">
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
              <a href={`/api/photos/${photo.id}/file`} download={`${photo.title}.${photo.filePath.split('.').pop()}`}>
                <Button variant="ghost" size="icon" className="rounded-full bg-white text-secondary-800 h-8 w-8">
                  <Download className="h-4 w-4" />
                </Button>
              </a>
            </div>
            <div className="p-3">
              <h3 className="font-medium text-secondary-900 text-sm">{photo.title}</h3>
              <p className="text-secondary-500 text-xs mt-1">Added {formatDate(photo.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

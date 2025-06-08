import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { formatDate } from "@/lib/utils";
import { CategoryBadge } from "@/components/common/CategoryBadge";
import { type MaintenanceEvent } from "@/types";
import { 
  Wrench, 
  Sprout, 
  Droplets, 
  Tag, 
  FileText, 
  Image,
  PlusCircle
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

// Map category to icon
const getCategoryIcon = (categoryId: number | null) => {
  switch (categoryId) {
    case 1: // Plumbing
      return <Droplets className="text-blue-600" />;
    case 2: // Electrical
      return <Wrench className="text-green-600" />;
    case 3: // HVAC
      return <Wrench className="text-yellow-600" />;
    case 4: // Appliances
      return <Wrench className="text-purple-600" />;
    case 5: // Garden
      return <Sprout className="text-pink-600" />;
    default:
      return <Wrench className="text-primary-600" />;
  }
};

interface TimelineViewProps {
  limit?: number;
  showViewAll?: boolean;
}

export function TimelineView({ limit, showViewAll = true }: TimelineViewProps) {
  const { data, isLoading } = useQuery<MaintenanceEvent[]>({
    queryKey: ['/api/maintenance-events', limit ? { limit } : undefined],
  });

  if (isLoading) {
    return (
      <div>
        {showViewAll && (
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-secondary-900">Maintenance Timeline</h2>
            <Link href="/timeline">
              <a className="text-sm text-primary-600 hover:text-primary-700 font-medium">View All</a>
            </Link>
          </div>
        )}
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-5 top-0 ml-px border-l border-gray-200 h-full"></div>
            
            {/* Timeline items */}
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="relative flex gap-5">
                  <div className="flex flex-col items-center">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="h-full"></div>
                  </div>
                  <div className="flex flex-col flex-1">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <div className="flex justify-between items-start mb-2">
                        <Skeleton className="h-5 w-40 mb-1" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-3/4 mb-1" />
                      <Skeleton className="h-4 w-1/2 mb-3" />
                      
                      <div className="flex mt-3 gap-2">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-20 mt-2 ml-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle when no data
  if (!data || data.length === 0) {
    return (
      <div>
        {showViewAll && (
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-secondary-900">Maintenance Timeline</h2>
            <Link href="/timeline">
              <a className="text-sm text-primary-600 hover:text-primary-700 font-medium">View All</a>
            </Link>
          </div>
        )}
        
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
          <p className="text-secondary-600 mb-3">No maintenance events recorded yet.</p>
          <Link href="/timeline/add">
            <Button className="inline-flex items-center">
              <PlusCircle className="mr-2 h-4 w-4" />
              Record Maintenance Event
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {showViewAll && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-secondary-900">Maintenance Timeline</h2>
          <Link href="/timeline">
            <a className="text-sm text-primary-600 hover:text-primary-700 font-medium">View All</a>
          </Link>
        </div>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-5 top-0 ml-px border-l border-gray-200 h-full"></div>
          
          {/* Timeline items */}
          <div className="space-y-6">
            {data.map((event) => (
              <div key={event.id} className="relative flex gap-5">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center border-2 border-white z-10">
                    {getCategoryIcon(event.categoryId)}
                  </div>
                  <div className="h-full"></div>
                </div>
                <div className="flex flex-col flex-1">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-secondary-900">{event.title}</h3>
                      <CategoryBadge categoryId={event.categoryId} />
                    </div>
                    <p className="text-sm text-secondary-600">{event.description}</p>
                    
                    <div className="flex mt-3 gap-2 flex-wrap">
                      {event.cost && (
                        <span className="bg-gray-100 text-secondary-600 text-xs px-2 py-1 rounded flex items-center">
                          <Tag className="mr-1 h-3 w-3" />
                          ${event.cost}
                        </span>
                      )}
                      
                      {event.photoIds && event.photoIds.length > 0 && (
                        <span className="bg-gray-100 text-secondary-600 text-xs px-2 py-1 rounded flex items-center">
                          <Image className="mr-1 h-3 w-3" />
                          {event.photoIds.length} photo{event.photoIds.length !== 1 ? 's' : ''}
                        </span>
                      )}
                      
                      {event.receiptPhotoIds && event.receiptPhotoIds.length > 0 && (
                        <span className="bg-gray-100 text-secondary-600 text-xs px-2 py-1 rounded flex items-center">
                          <FileText className="mr-1 h-3 w-3" />
                          {event.receiptPhotoIds.length} receipt{event.receiptPhotoIds.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-secondary-500 ml-4 mt-2">
                    {formatDate(event.date)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

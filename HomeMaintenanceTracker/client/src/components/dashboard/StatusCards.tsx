import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardSummary } from "@/types";
import { formatDate } from "@/lib/utils";
import { ClipboardList, CalendarClock, Image, StickyNote, ArrowUp, ArrowDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function StatusCards() {
  const { data, isLoading } = useQuery<DashboardSummary>({
    queryKey: ['/api/maintenance-events/summary'],
    // Fallback data when API isn't ready
    initialData: {
      totalRecords: 42,
      upcomingExpirations: 3,
      photosStored: 28,
      maintenanceNotes: 16,
      lastNoteDate: "2023-05-08T00:00:00Z"
    }
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-4">
            <p className="text-secondary-600 text-sm font-medium">Total Records</p>
            <div className="bg-blue-100 p-2 rounded-full text-primary-600">
              <ClipboardList className="h-4 w-4" />
            </div>
          </div>
          <h3 className="text-2xl font-semibold text-secondary-900">{data.totalRecords}</h3>
          <div className="flex items-center mt-1">
            <span className="text-green-600 text-xs font-medium flex items-center">
              <ArrowUp className="h-3 w-3 mr-1" /> 12%
            </span>
            <span className="text-secondary-500 text-xs ml-2">from last month</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-4">
            <p className="text-secondary-600 text-sm font-medium">Upcoming Expirations</p>
            <div className="bg-red-100 p-2 rounded-full text-red-600">
              <CalendarClock className="h-4 w-4" />
            </div>
          </div>
          <h3 className="text-2xl font-semibold text-secondary-900">{data.upcomingExpirations}</h3>
          <div className="flex items-center mt-1">
            <span className="text-red-600 text-xs font-medium flex items-center">
              <ArrowDown className="h-3 w-3 mr-1" /> 2
            </span>
            <span className="text-secondary-500 text-xs ml-2">in next 30 days</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-4">
            <p className="text-secondary-600 text-sm font-medium">Photos Stored</p>
            <div className="bg-green-100 p-2 rounded-full text-green-600">
              <Image className="h-4 w-4" />
            </div>
          </div>
          <h3 className="text-2xl font-semibold text-secondary-900">{data.photosStored}</h3>
          <div className="flex items-center mt-1">
            <span className="text-green-600 text-xs font-medium flex items-center">
              <ArrowUp className="h-3 w-3 mr-1" /> 5
            </span>
            <span className="text-secondary-500 text-xs ml-2">new this month</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-4">
            <p className="text-secondary-600 text-sm font-medium">Maintenance Notes</p>
            <div className="bg-yellow-100 p-2 rounded-full text-amber-600">
              <StickyNote className="h-4 w-4" />
            </div>
          </div>
          <h3 className="text-2xl font-semibold text-secondary-900">{data.maintenanceNotes}</h3>
          <div className="flex items-center mt-1">
            <span className="text-secondary-500 text-xs">
              {data.lastNoteDate ? `Last added on ${formatDate(data.lastNoteDate)}` : 'No notes yet'}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

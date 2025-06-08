import React from "react";
import { StatusCards } from "@/components/dashboard/StatusCards";
import { UpcomingExpirations } from "@/components/dashboard/UpcomingExpirations";
import { RecentPhotos } from "@/components/dashboard/RecentPhotos";
import { RecentNotes } from "@/components/dashboard/RecentNotes";
import { TimelineView } from "@/components/timeline/TimelineView";
import { Button } from "@/components/ui/button";
import { PlusCircle, Filter, Calendar } from "lucide-react";

export default function Dashboard() {
  return (
    <>
      <div className="mb-6" id="dashboard">
        <h1 className="text-2xl font-semibold text-secondary-900">Dashboard</h1>
        <p className="text-sm text-secondary-600">Overview of your home maintenance records</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <Button className="flex items-center">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New
        </Button>
        <Button variant="outline" className="flex items-center">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
        <Button variant="outline" className="flex items-center ml-auto">
          <Calendar className="mr-2 h-4 w-4" />
          This Month
        </Button>
      </div>

      <StatusCards />
      
      <UpcomingExpirations />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <RecentPhotos />
        </div>
        
        <div>
          <RecentNotes />
        </div>
      </div>

      <div className="mt-8">
        <TimelineView limit={3} />
      </div>
    </>
  );
}

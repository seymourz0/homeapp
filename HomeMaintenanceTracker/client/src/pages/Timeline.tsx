import React, { useState } from "react";
import { TimelineView } from "@/components/timeline/TimelineView";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function Timeline() {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-secondary-900">Maintenance Timeline</h1>
          <p className="text-sm text-secondary-600">Track your home maintenance history</p>
        </div>
        
        <Button className="flex items-center">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </div>
      
      <TimelineView showViewAll={false} />
    </>
  );
}

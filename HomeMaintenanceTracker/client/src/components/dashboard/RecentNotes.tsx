import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { formatDate } from "@/lib/utils";
import { CategoryBadge } from "@/components/common/CategoryBadge";
import { type Note } from "@/types";
import { Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export function RecentNotes() {
  const { data, isLoading } = useQuery<Note[]>({
    queryKey: ['/api/notes/recent'],
  });

  if (isLoading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-secondary-900">Recent Notes</h2>
          <Link href="/notes">
            <a className="text-sm text-primary-600 hover:text-primary-700 font-medium">View All</a>
          </Link>
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <Skeleton className="h-5 w-32 mb-1" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4 mb-3" />
              <Skeleton className="h-4 w-24" />
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
          <h2 className="text-lg font-semibold text-secondary-900">Recent Notes</h2>
          <Link href="/notes">
            <a className="text-sm text-primary-600 hover:text-primary-700 font-medium">View All</a>
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-secondary-600">No maintenance notes added yet.</p>
          <Link href="/notes">
            <Button variant="link" className="mt-2">
              Add your first note
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-secondary-900">Recent Notes</h2>
        <Link href="/notes">
          <a className="text-sm text-primary-600 hover:text-primary-700 font-medium">View All</a>
        </Link>
      </div>
      
      <div className="space-y-4">
        {data.map((note) => (
          <div key={note.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-secondary-900">{note.title}</h3>
              <CategoryBadge categoryId={note.categoryId} />
            </div>
            <p className="text-sm text-secondary-600 mb-3 line-clamp-2">{note.content}</p>
            <div className="text-xs text-secondary-500 flex items-center">
              <Clock className="mr-1 h-3 w-3" />
              {formatDate(note.createdAt)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { formatDate, getExpirationStatus } from "@/lib/utils";
import { CategoryBadge } from "@/components/common/CategoryBadge";
import { type Warranty } from "@/types";
import { FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function UpcomingExpirations() {
  const { data, isLoading } = useQuery<Warranty[]>({
    queryKey: ['/api/warranties/upcoming'],
  });

  // Map status to styles
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'danger':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'safe':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-secondary-900 mb-4">Upcoming Expirations</h2>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Expiration Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1, 2, 3].map((i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center">
                        <FileText className="text-secondary-400 mr-3 h-5 w-5" />
                        <div>
                          <Skeleton className="h-4 w-24 mb-1" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-8 w-24 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    );
  }

  // Handle when no data
  if (!data || data.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-secondary-900 mb-4">Upcoming Expirations</h2>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-secondary-600">No upcoming expirations in the next 30 days.</p>
          <Link href="/warranties">
            <Button variant="link" className="mt-2">
              Manage Warranties
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-secondary-900 mb-4">Upcoming Expirations</h2>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Expiration Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((warranty) => {
                const expiration = getExpirationStatus(warranty.expirationDate);
                
                return (
                  <TableRow key={warranty.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <FileText className="text-secondary-400 mr-3 h-5 w-5" />
                        <div>
                          <div className="text-sm font-medium text-secondary-900">{warranty.title}</div>
                          <div className="text-xs text-secondary-500">{warranty.location}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <CategoryBadge categoryId={warranty.categoryId} />
                    </TableCell>
                    <TableCell className="text-sm text-secondary-600">
                      {formatDate(warranty.expirationDate)}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(expiration.status)}`}>
                        {expiration.text}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-sm font-medium">
                      <Button variant="link" className="mr-3 h-auto p-0 text-primary-600 hover:text-primary-900">
                        Renew
                      </Button>
                      <Link href={`/warranties/${warranty.id}`}>
                        <Button variant="link" className="h-auto p-0 text-secondary-600 hover:text-secondary-900">
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

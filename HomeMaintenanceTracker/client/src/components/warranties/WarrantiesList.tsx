import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CategoryBadge } from "@/components/common/CategoryBadge";
import { formatDate, getExpirationStatus } from "@/lib/utils";
import { Warranty } from "@/types";
import { useCategories } from "@/hooks/useCategories";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle, FileText, Edit, Trash } from "lucide-react";
import { WarrantyFormModal } from "./WarrantyFormModal";

export function WarrantiesList() {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedWarranty, setSelectedWarranty] = useState<Warranty | null>(null);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const { categories } = useCategories();
  
  const { data: warranties, isLoading } = useQuery<Warranty[]>({
    queryKey: ['/api/warranties', activeCategory ? { categoryId: activeCategory } : undefined],
  });

  const handleAddWarranty = () => {
    setSelectedWarranty(null);
    setIsFormModalOpen(true);
  };

  const handleEditWarranty = (warranty: Warranty) => {
    setSelectedWarranty(warranty);
    setIsFormModalOpen(true);
  };

  const handleCategoryFilter = (categoryId: number | null) => {
    setActiveCategory(categoryId);
  };

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
      <div>
        <div className="flex justify-between items-center mb-4">
          <div></div>
          <Button onClick={handleAddWarranty} className="flex items-center">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Warranty
          </Button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-wrap gap-4 mb-4">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Expiration Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1, 2, 3, 4].map((i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center">
                        <FileText className="text-secondary-400 mr-3 h-5 w-5" />
                        <Skeleton className="h-5 w-32" />
                      </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
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
        
        <WarrantyFormModal 
          open={isFormModalOpen} 
          onOpenChange={setIsFormModalOpen} 
          warranty={selectedWarranty}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div></div>
        <Button onClick={handleAddWarranty} className="flex items-center">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Warranty
        </Button>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-wrap gap-4 mb-4">
          <Button 
            variant={activeCategory === null ? "default" : "outline"}
            onClick={() => handleCategoryFilter(null)}
            className="px-3 py-1 h-auto"
          >
            All Warranties
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
        
        {!warranties || warranties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-secondary-600 mb-4">No warranties found. Add your first warranty or expiration date.</p>
            <Button onClick={handleAddWarranty} className="flex items-center mx-auto">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Warranty
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Expiration Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {warranties.map((warranty) => {
                  const expiration = getExpirationStatus(warranty.expirationDate);
                  
                  return (
                    <TableRow key={warranty.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <FileText className="text-secondary-400 mr-3 h-5 w-5" />
                          <div>
                            <div className="text-sm font-medium text-secondary-900">{warranty.title}</div>
                            {warranty.description && (
                              <div className="text-xs text-secondary-500 truncate max-w-xs">
                                {warranty.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <CategoryBadge categoryId={warranty.categoryId} />
                      </TableCell>
                      <TableCell className="text-sm text-secondary-600">
                        {warranty.location || "-"}
                      </TableCell>
                      <TableCell className="text-sm text-secondary-600">
                        {formatDate(warranty.expirationDate)}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(expiration.status)}`}>
                          {expiration.text}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 mr-1"
                            onClick={() => handleEditWarranty(warranty)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      
      <WarrantyFormModal 
        open={isFormModalOpen} 
        onOpenChange={setIsFormModalOpen} 
        warranty={selectedWarranty}
      />
    </div>
  );
}

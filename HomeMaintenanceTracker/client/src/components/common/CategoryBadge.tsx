import React from "react";
import { cn, getCategoryColorClass } from "@/lib/utils";
import { useCategories, getCategoryById } from "@/hooks/useCategories";

interface CategoryBadgeProps {
  categoryId: number | null;
  className?: string;
}

export function CategoryBadge({ categoryId, className }: CategoryBadgeProps) {
  const { categories } = useCategories();
  const category = getCategoryById(categories, categoryId);
  
  if (!category) {
    return null;
  }
  
  return (
    <span 
      className={cn(
        "px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full",
        getCategoryColorClass(category.color),
        className
      )}
    >
      {category.name}
    </span>
  );
}

export function CategoryDot({ categoryId, className }: CategoryBadgeProps) {
  const { categories } = useCategories();
  const category = getCategoryById(categories, categoryId);
  
  if (!category) {
    return null;
  }
  
  // Extract background color from the category color
  const bgColorStyle = {
    backgroundColor: category.color
  };
  
  return (
    <span 
      className={cn("w-2 h-2 rounded-full mr-3", className)}
      style={bgColorStyle}
    />
  );
}

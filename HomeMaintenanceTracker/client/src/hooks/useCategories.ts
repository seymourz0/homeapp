import { useQuery } from "@tanstack/react-query";
import { Category } from "@/types";

export function useCategories() {
  const { data: categories, isLoading, error } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  return {
    categories: categories || [],
    isLoading,
    error,
  };
}

export function getCategoryById(categories: Category[], id: number | null): Category | undefined {
  if (!id) return undefined;
  return categories.find(category => category.id === id);
}

export function getCategoryColor(categories: Category[], id: number | null): string {
  const category = getCategoryById(categories, id);
  return category?.color || "#6b7280"; // default gray
}

export function getCategoryName(categories: Category[], id: number | null): string {
  const category = getCategoryById(categories, id);
  return category?.name || "Uncategorized";
}

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isFuture } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "MMM dd, yyyy");
}

export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "MMM dd, yyyy h:mm a");
}

export function timeAgo(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

export function getDaysUntil(date: Date | string): number {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffTime = dateObj.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function getExpirationStatus(date: Date | string): {
  status: 'expired' | 'danger' | 'warning' | 'safe';
  daysLeft: number;
  text: string;
} {
  const daysLeft = getDaysUntil(date);
  
  if (daysLeft < 0) {
    return {
      status: 'expired',
      daysLeft,
      text: `Expired ${Math.abs(daysLeft)} days ago`
    };
  } else if (daysLeft <= 7) {
    return {
      status: 'danger',
      daysLeft,
      text: `Expires in ${daysLeft} days`
    };
  } else if (daysLeft <= 30) {
    return {
      status: 'warning',
      daysLeft,
      text: `Expires in ${daysLeft} days`
    };
  } else {
    return {
      status: 'safe',
      daysLeft,
      text: `Expires in ${daysLeft} days`
    };
  }
}

export function downloadJSON(data: any, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadCSV(data: any[], filename: string): void {
  if (!data.length) return;
  
  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvContent = [
    headers.join(','), // Headers row
    ...data.map(row => 
      headers.map(field => {
        const value = row[field];
        // Handle values that need to be quoted (strings with commas, quotes, or newlines)
        if (typeof value === 'string') {
          return `"${value.replace(/"/g, '""')}"`;
        } else if (value instanceof Date) {
          return `"${value.toISOString()}"`;
        } else if (value === null || value === undefined) {
          return '';
        } else if (typeof value === 'object') {
          return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function getCategoryColorClass(color: string): string {
  if (!color) return "bg-gray-100 text-gray-800";
  
  const colorMap: Record<string, string> = {
    "#3b82f6": "bg-blue-100 text-blue-800", // Plumbing
    "#10b981": "bg-green-100 text-green-800", // Electrical
    "#f59e0b": "bg-yellow-100 text-yellow-800", // HVAC
    "#8b5cf6": "bg-purple-100 text-purple-800", // Appliances
    "#ec4899": "bg-pink-100 text-pink-800", // Garden
    // Add more as needed
  };

  return colorMap[color] || "bg-gray-100 text-gray-800";
}

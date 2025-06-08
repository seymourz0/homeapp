import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useCategories } from "@/hooks/useCategories";
import { ExportDataModal } from "@/components/common/ExportDataModal";
import { CategoryDot } from "@/components/common/CategoryBadge";
import { HeartPulse, LayoutDashboard, Clock, Image, StickyNote, Calendar } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const [location] = useLocation();
  const { categories } = useCategories();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Close sidebar on mobile when changing routes
  const handleNavLinkClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  // Update isMobile state on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div className={cn(
      "sidebar fixed md:relative w-64 md:w-64 bg-white h-full border-r border-gray-200 z-30 shadow-sm transition-transform",
      isMobile && !isOpen ? "-translate-x-full" : "translate-x-0"
    )}>
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <HeartPulse className="h-6 w-6 text-primary-600" />
          <h1 className="font-bold text-xl text-secondary-900">HomeKeep</h1>
        </div>
        <p className="text-xs text-secondary-500 mt-1">Home Maintenance Tracker</p>
      </div>
      
      <nav className="mt-6 px-4">
        <div className="mb-4">
          <p className="text-xs font-semibold text-secondary-500 uppercase tracking-wider mb-2 px-2">MAIN</p>
          
          <Link href="/">
            <a 
              onClick={handleNavLinkClick}
              className={cn(
                "flex items-center px-2 py-2 text-sm rounded-md font-medium mb-1",
                location === "/" 
                  ? "bg-primary-50 text-primary-600 border-l-3 border-primary-600" 
                  : "text-secondary-600 hover:bg-gray-100"
              )}
            >
              <LayoutDashboard className="mr-3 h-5 w-5" />
              Dashboard
            </a>
          </Link>
          
          <Link href="/timeline">
            <a 
              onClick={handleNavLinkClick}
              className={cn(
                "flex items-center px-2 py-2 text-sm rounded-md font-medium mb-1",
                location === "/timeline" 
                  ? "bg-primary-50 text-primary-600 border-l-3 border-primary-600" 
                  : "text-secondary-600 hover:bg-gray-100"
              )}
            >
              <Clock className="mr-3 h-5 w-5" />
              Timeline
            </a>
          </Link>
          
          <Link href="/photos">
            <a 
              onClick={handleNavLinkClick}
              className={cn(
                "flex items-center px-2 py-2 text-sm rounded-md font-medium mb-1",
                location === "/photos" 
                  ? "bg-primary-50 text-primary-600 border-l-3 border-primary-600" 
                  : "text-secondary-600 hover:bg-gray-100"
              )}
            >
              <Image className="mr-3 h-5 w-5" />
              Photos
            </a>
          </Link>
          
          <Link href="/notes">
            <a 
              onClick={handleNavLinkClick}
              className={cn(
                "flex items-center px-2 py-2 text-sm rounded-md font-medium mb-1",
                location === "/notes" 
                  ? "bg-primary-50 text-primary-600 border-l-3 border-primary-600" 
                  : "text-secondary-600 hover:bg-gray-100"
              )}
            >
              <StickyNote className="mr-3 h-5 w-5" />
              Notes
            </a>
          </Link>
          
          <Link href="/warranties">
            <a 
              onClick={handleNavLinkClick}
              className={cn(
                "flex items-center px-2 py-2 text-sm rounded-md font-medium mb-1",
                location === "/warranties" 
                  ? "bg-primary-50 text-primary-600 border-l-3 border-primary-600" 
                  : "text-secondary-600 hover:bg-gray-100"
              )}
            >
              <Calendar className="mr-3 h-5 w-5" />
              Warranties
            </a>
          </Link>
        </div>
        
        <div className="mb-4">
          <p className="text-xs font-semibold text-secondary-500 uppercase tracking-wider mb-2 px-2">CATEGORIES</p>
          
          {categories.map(category => (
            <Link key={category.id} href={`/category/${category.id}`}>
              <a 
                onClick={handleNavLinkClick}
                className="flex items-center px-2 py-2 text-sm text-secondary-600 rounded-md font-medium mb-1 hover:bg-gray-100"
              >
                <CategoryDot categoryId={category.id} />
                {category.name}
              </a>
            </Link>
          ))}
        </div>
      </nav>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <ExportDataModal />
      </div>
    </div>
  );
}

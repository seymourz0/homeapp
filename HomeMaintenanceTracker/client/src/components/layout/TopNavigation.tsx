import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, Search, Bell, User } from "lucide-react";

interface TopNavigationProps {
  toggleSidebar: () => void;
}

export function TopNavigation({ toggleSidebar }: TopNavigationProps) {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-20">
      <div className="flex justify-between items-center px-4 py-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleSidebar}
          className="block md:hidden p-2 text-secondary-700 hover:bg-gray-100 rounded-md focus:outline-none"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center md:ml-4">
          <div className="relative max-w-md w-full mr-4 hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input 
              type="text" 
              placeholder="Search maintenance records..." 
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
          
          <div className="flex space-x-2 ml-auto">
            <Button 
              variant="ghost" 
              size="icon"
              className="p-2 text-secondary-700 hover:bg-gray-100 rounded-md focus:outline-none relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary-600 rounded-full"></span>
            </Button>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
                JD
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

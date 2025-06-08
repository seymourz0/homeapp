import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNavigation } from "@/components/layout/TopNavigation";
import { useIsMobile } from "@/hooks/useMobile";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

  // Update sidebar state when screen size changes
  useEffect(() => {
    setIsSidebarOpen(!isMobile);
  }, [isMobile]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <TopNavigation toggleSidebar={toggleSidebar} />

        <main className="p-4 md:p-6">
          {children}
        </main>

        <footer className="bg-white border-t border-gray-200 mt-8">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <div className="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-primary-600">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    <path d="M12 7h.01"></path>
                    <path d="M16 15h.01"></path>
                    <path d="M8 9h.01"></path>
                  </svg>
                  <h1 className="font-bold text-lg text-secondary-900">HomeKeep</h1>
                </div>
                <p className="text-xs text-secondary-500 mt-1">Your complete home maintenance solution</p>
              </div>
              <div className="flex space-x-6">
                <a href="#" className="text-secondary-500 hover:text-secondary-900">Help</a>
                <a href="#" className="text-secondary-500 hover:text-secondary-900">Privacy</a>
                <a href="#" className="text-secondary-500 hover:text-secondary-900">Terms</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription,
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { downloadJSON, downloadCSV } from "@/lib/utils";
import { Home, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExportDataModalProps {
  trigger?: React.ReactNode;
}

export function ExportDataModal({ trigger }: ExportDataModalProps) {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/export'],
    enabled: open, // Only fetch when modal is open
  });
  
  const handleExportJSON = () => {
    if (data) {
      downloadJSON(data, `homekeep-export-${new Date().toISOString().slice(0, 10)}.json`);
      toast({
        title: "Export successful",
        description: "Your home data has been exported as JSON",
      });
      setOpen(false);
    }
  };
  
  const handleExportCSV = () => {
    if (data) {
      // Export each entity type as a separate CSV
      if (data.categories?.length) {
        downloadCSV(data.categories, `homekeep-categories-${new Date().toISOString().slice(0, 10)}.csv`);
      }
      if (data.photos?.length) {
        downloadCSV(data.photos, `homekeep-photos-${new Date().toISOString().slice(0, 10)}.csv`);
      }
      if (data.notes?.length) {
        downloadCSV(data.notes, `homekeep-notes-${new Date().toISOString().slice(0, 10)}.csv`);
      }
      if (data.warranties?.length) {
        downloadCSV(data.warranties, `homekeep-warranties-${new Date().toISOString().slice(0, 10)}.csv`);
      }
      if (data.maintenanceEvents?.length) {
        downloadCSV(data.maintenanceEvents, `homekeep-maintenance-events-${new Date().toISOString().slice(0, 10)}.csv`);
      }
      
      toast({
        title: "Export successful",
        description: "Your home data has been exported as CSV files",
      });
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="flex items-center justify-center py-2 px-4 text-sm font-medium text-secondary-700 bg-gray-100 rounded-md hover:bg-gray-200">
            <FileText className="w-4 h-4 mr-2" />
            Export Home Data
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Home Data</DialogTitle>
          <DialogDescription>
            Export all your home maintenance records for backup or handover to new owners.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="json" className="mt-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="json">JSON Format</TabsTrigger>
            <TabsTrigger value="csv">CSV Format</TabsTrigger>
          </TabsList>
          
          <TabsContent value="json" className="mt-4">
            <p className="text-sm text-secondary-600 mb-4">
              Export all your data as a single JSON file, which can be used for complete backup or imported into another system.
            </p>
            <div className="p-4 bg-gray-50 rounded-md border border-gray-200 text-sm">
              <p className="font-medium">Included data:</p>
              <ul className="mt-2 space-y-1">
                <li>• Categories</li>
                <li>• Photos (metadata only)</li>
                <li>• Notes</li>
                <li>• Warranties & Expirations</li>
                <li>• Maintenance Events</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="csv" className="mt-4">
            <p className="text-sm text-secondary-600 mb-4">
              Export your data as separate CSV files, which can be opened in spreadsheet applications like Excel or Google Sheets.
            </p>
            <div className="p-4 bg-gray-50 rounded-md border border-gray-200 text-sm">
              <p className="font-medium">Exported files:</p>
              <ul className="mt-2 space-y-1">
                <li>• homekeep-categories.csv</li>
                <li>• homekeep-photos.csv</li>
                <li>• homekeep-notes.csv</li>
                <li>• homekeep-warranties.csv</li>
                <li>• homekeep-maintenance-events.csv</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex items-center space-x-2 text-xs text-secondary-500 mt-2">
          <Home className="w-4 h-4" />
          <p>Photo files must be downloaded separately.</p>
        </div>
        
        <DialogFooter className="sm:justify-end mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Tabs defaultValue="json" className="hidden">
            <TabsContent value="json">
              <Button onClick={handleExportJSON} disabled={isLoading}>
                {isLoading ? "Loading..." : "Export as JSON"}
              </Button>
            </TabsContent>
            <TabsContent value="csv">
              <Button onClick={handleExportCSV} disabled={isLoading}>
                {isLoading ? "Loading..." : "Export as CSV"}
              </Button>
            </TabsContent>
          </Tabs>
          <Button onClick={handleExportJSON} disabled={isLoading}>
            {isLoading ? "Loading..." : "Export Data"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

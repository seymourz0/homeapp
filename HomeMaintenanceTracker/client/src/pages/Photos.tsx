import React from "react";
import { PhotoGallery } from "@/components/photos/PhotoGallery";

export default function Photos() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-secondary-900">Photos</h1>
        <p className="text-sm text-secondary-600">Store and organize important home photos</p>
      </div>
      
      <PhotoGallery />
    </div>
  );
}

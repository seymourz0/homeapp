import React from "react";
import { NotesList } from "@/components/notes/NotesList";

export default function Notes() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-secondary-900">Maintenance Notes</h1>
        <p className="text-sm text-secondary-600">Keep track of important maintenance information</p>
      </div>
      
      <NotesList />
    </div>
  );
}

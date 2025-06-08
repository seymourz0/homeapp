import React from "react";
import { WarrantiesList } from "@/components/warranties/WarrantiesList";

export default function Warranties() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-secondary-900">Warranties & Expirations</h1>
        <p className="text-sm text-secondary-600">Track warranty information and important expiration dates</p>
      </div>
      
      <WarrantiesList />
    </div>
  );
}

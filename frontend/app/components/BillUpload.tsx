"use client";

import api from "../../libraries/axios";
import { Upload, FileText } from "lucide-react";

export interface Bill {
  billFile: string;
  billName: string;
}

// File picker: works with computer files, and the camera on phones
export function BillPicker({
  bill,
  onChange,
}: {
  bill: Bill | null;
  onChange: (b: Bill | null) => void;
}) {
  const pick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("File is too large. Please choose a file under 2 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange({ billFile: reader.result as string, billName: file.name });
    reader.readAsDataURL(file); // turns the file into text we can save
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <label className="flex items-center gap-2 border border-dashed border-gray-300 rounded-xl px-4 py-2 text-sm text-soft cursor-pointer hover:bg-gray-50">
        <Upload size={14} />
        {bill ? "Change bill" : "Upload bill (image or PDF)"}
        <input type="file" accept="image/*,application/pdf" onChange={pick} className="hidden" />
      </label>
      {bill && (
        <span className="text-xs text-beige flex items-center gap-1">
          <FileText size={13} /> {bill.billName}
          <button onClick={() => onChange(null)} className="text-red-500 ml-2">Remove</button>
        </span>
      )}
    </div>
  );
}

// Opens a saved bill in a new tab
export async function openBill(kind: "purchases" | "sales", id: number) {
  try {
    const res = await api.get(`/api/${kind}/${id}/bill`);
    const blob = await (await fetch(res.data.billFile)).blob();
    window.open(URL.createObjectURL(blob), "_blank");
  } catch {
    alert("Could not open the bill.");
  }
}
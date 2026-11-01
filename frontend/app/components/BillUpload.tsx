"use client";

import api from "../../libraries/axios";
import { Upload, FileText } from "lucide-react";

export interface Bill {
  billFile: string;
  billName: string;
}

const MAX_BYTES = 2 * 1024 * 1024; // 2 MB limit

// Reads any file as a text string (data URL)
const readAsDataUrl = (file: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

// Shrinks an image: max 1600px wide, JPEG quality 0.7
const compressImage = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, 1600 / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.7));
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });

export function BillPicker({
  bill,
  onChange,
}: {
  bill: Bill | null;
  onChange: (b: Bill | null) => void;
}) {
  const pick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      let data: string;
      let name = file.name;

      if (file.type.startsWith("image/")) {
        // Images are compressed automatically
        data = await compressImage(file);
        name = name.replace(/\.[^.]+$/, "") + ".jpg";
      } else if (file.type === "application/pdf") {
        // PDFs can't be compressed here, so they must be under 2 MB
        if (file.size > MAX_BYTES) {
          alert("This PDF is over 2 MB. Please choose a smaller PDF or upload a photo of the bill.");
          return;
        }
        data = await readAsDataUrl(file);
      } else {
        alert("Please choose an image or a PDF.");
        return;
      }

      // Final safety check on the size we will actually save
      if (data.length * 0.75 > MAX_BYTES) {
        alert("File is still over 2 MB after compression. Please use a smaller file.");
        return;
      }

      onChange({ billFile: data, billName: name });
    } catch {
      alert("Could not read this file.");
    }
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
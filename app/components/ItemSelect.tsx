"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

interface Item {
  id: number;
  name: string;
  unit: string;
  quantity?: number;
}

export default function ItemSelect({
  items,
  value,
  onChange,
  showStock = false, // show available quantity (used on Sales)
}: {
  items: Item[];
  value: string;
  onChange: (id: string) => void;
  showStock?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const boxRef = useRef<HTMLDivElement>(null);

  // The item currently chosen, to show its name on the button
  const selected = items.find((i) => String(i.id) === value);

  // Filter the list as the user types
  const filtered = items.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  // Close the list when clicking anywhere outside it
  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={boxRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between bg-gray-50 border border-gray-200 text-beige rounded-xl px-3 py-2 text-sm text-left"
      >
        <span className={selected ? "" : "text-soft/60"}>
          {selected ? selected.name : "Select item"}
        </span>
        <ChevronDown size={14} className="text-soft" />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-card border border-gray-200 rounded-xl shadow-lg p-2">
          <input
            autoFocus
            placeholder="Search item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none mb-2"
          />
          <div className="max-h-56 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-soft text-xs p-2">No items found</p>
            ) : (
              filtered.map((i) => (
                <button
                  type="button"
                  key={i.id}
                  onClick={() => {
                    onChange(String(i.id));
                    setOpen(false);
                    setSearch("");
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-beige hover:bg-gray-100 rounded-lg flex justify-between"
                >
                  <span>{i.name}</span>
                  {showStock && (
                    <span className="text-soft text-xs">{i.quantity} left</span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
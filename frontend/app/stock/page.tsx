"use client";

import { useEffect, useState } from "react";
import api from "../../libraries/axios";
import { AlertTriangle, Plus, Minus, Package } from "lucide-react";

interface Item {
  id: number;
  name: string;
  unit: string;
  quantity: number;
  threshold: number;
}

export default function StockPage() {
  const [activeTab, setActiveTab] = useState<"stock" | "history">("stock");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [adjustModal, setAdjustModal] = useState<{
    item: Item;
    type: "add" | "deduct";
  } | null>(null);
  const [adjustQty, setAdjustQty] = useState(0);
  const [adjustNote, setAdjustNote] = useState("");
  const [form, setForm] = useState({
    name: "",
    unit: "",
    quantity: 0,
    threshold: 10,
  });

  const fetchItems = async () => {
    try {
      const res = await api.get("/api/stock");
      setItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAddItem = async () => {
    try {
      await api.post("/api/stock", form);
      setForm({ name: "", unit: "", quantity: 0, threshold: 10 });
      setShowForm(false);
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdjust = async () => {
    if (!adjustModal) return;
    try {
      const endpoint =
        adjustModal.type === "add"
          ? `/api/stock/${adjustModal.item.id}/add`
          : `/api/stock/${adjustModal.item.id}/deduct`;
      await api.post(endpoint, {
        quantity: Number(adjustQty),
        note: adjustNote,
      });
      setAdjustModal(null);
      setAdjustQty(0);
      setAdjustNote("");
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const lowStockItems = items.filter((i) => i.quantity <= i.threshold);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-beige text-2xl font-bold">Stock</h2>
          <p className="text-soft text-sm mt-1">Live inventory overview</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-secondary transition-colors"
        >
          + Add Item
        </button>
      </div>

      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-500" />
            <p className="text-red-600 text-sm font-semibold">
              {lowStockItems.length} item{lowStockItems.length > 1 ? "s" : ""} running low
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStockItems.map((item) => (
              <span
                key={item.id}
                className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full"
              >
                {item.name} — {item.quantity} {item.unit} left
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Add Item Form */}
      {showForm && (
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
          <h3 className="text-beige font-semibold">New Item</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-soft text-xs">Item Name</label>
              <input
                placeholder="e.g. MS Pipe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="bg-gray-50 border border-gray-200 text-beige placeholder:text-soft/40 rounded-xl px-4 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-soft text-xs">Unit</label>
              <input
                placeholder="e.g. kg, bags, pcs"
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                className="bg-gray-50 border border-gray-200 text-beige placeholder:text-soft/40 rounded-xl px-4 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-soft text-xs">Opening Stock</label>
              <input
                type="number"
                placeholder="0"
                value={form.quantity || ""}
                onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                className="bg-gray-50 border border-gray-200 text-beige placeholder:text-soft/40 rounded-xl px-4 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-soft text-xs">Minimum Stock Level</label>
              <input
                type="number"
                placeholder="10"
                value={form.threshold || ""}
                onChange={(e) => setForm({ ...form, threshold: Number(e.target.value) })}
                className="bg-gray-50 border border-gray-200 text-beige placeholder:text-soft/40 rounded-xl px-4 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleAddItem}
              className="bg-primary text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-secondary transition-colors"
            >
              Save Item
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="border border-gray-200 text-soft px-5 py-2 rounded-xl text-sm hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      

      {/* Search */}
      <input
        placeholder="Search items..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="bg-card border border-gray-200 text-beige placeholder:text-soft/40 rounded-xl px-4 py-2 text-sm outline-none focus:border-primary w-full max-w-sm"
      />

      {/* Items Table */}
      <div className="bg-card rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left text-soft px-6 py-4 font-medium">Item</th>
              <th className="text-left text-soft px-6 py-4 font-medium">Unit</th>
              <th className="text-left text-soft px-6 py-4 font-medium">Quantity</th>
              <th className="text-left text-soft px-6 py-4 font-medium">Min Level</th>
              <th className="text-left text-soft px-6 py-4 font-medium">Status</th>
              <th className="text-left text-soft px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center text-soft py-8">Loading...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-soft py-8">No items found.</td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-beige font-medium flex items-center gap-2">
                    <Package size={16} className="text-soft" />
                    {item.name}
                  </td>
                  <td className="px-6 py-4 text-soft">{item.unit}</td>
                  <td className="px-6 py-4 text-beige font-semibold">{item.quantity}</td>
                  <td className="px-6 py-4 text-soft">{item.threshold}</td>
                  <td className="px-6 py-4">
                    {item.quantity <= item.threshold ? (
                      <span className="bg-red-50 text-red-500 px-2 py-1 rounded-full text-xs font-medium">
                        Low Stock
                      </span>
                    ) : (
                      <span className="bg-green-50 text-green-600 px-2 py-1 rounded-full text-xs font-medium">
                        In Stock
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setAdjustModal({ item, type: "add" })}
                        className="flex items-center gap-1 bg-green-50 text-green-600 px-3 py-1 rounded-lg text-xs font-medium hover:bg-green-100 transition-colors"
                      >
                        <Plus size={12} /> Add
                      </button>
                      <button
                        onClick={() => setAdjustModal({ item, type: "deduct" })}
                        className="flex items-center gap-1 bg-red-50 text-red-500 px-3 py-1 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors"
                      >
                        <Minus size={12} /> Deduct
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Adjust Stock Modal */}
      {adjustModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-card rounded-2xl p-6 shadow-xl w-full max-w-sm flex flex-col gap-4">
            <h3 className="text-beige font-semibold text-lg">
              {adjustModal.type === "add" ? "Add Stock" : "Deduct Stock"} —{" "}
              {adjustModal.item.name}
            </h3>
            <p className="text-soft text-sm">
              Current: {adjustModal.item.quantity} {adjustModal.item.unit}
            </p>

            <div className="flex flex-col gap-1">
              <label className="text-soft text-xs">Quantity</label>
              <input
                type="number"
                placeholder="Enter quantity"
                value={adjustQty || ""}
                onChange={(e) => setAdjustQty(Number(e.target.value))}
                className="bg-gray-50 border border-gray-200 text-beige placeholder:text-soft/40 rounded-xl px-4 py-2 text-sm outline-none focus:border-primary"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-soft text-xs">Note (optional)</label>
              <input
                placeholder="e.g. Manual correction"
                value={adjustNote}
                onChange={(e) => setAdjustNote(e.target.value)}
                className="bg-gray-50 border border-gray-200 text-beige placeholder:text-soft/40 rounded-xl px-4 py-2 text-sm outline-none focus:border-primary"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAdjust}
                className={`flex-1 text-white py-2 rounded-xl text-sm font-medium transition-colors ${
                  adjustModal.type === "add"
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {adjustModal.type === "add" ? "Add Stock" : "Deduct Stock"}
              </button>
              <button
                onClick={() => {
                  setAdjustModal(null);
                  setAdjustQty(0);
                  setAdjustNote("");
                }}
                className="flex-1 border border-gray-200 text-soft py-2 rounded-xl text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
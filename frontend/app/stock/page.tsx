"use client";

import { useEffect, useState } from "react";
import api from "../../libraries/axios";
import { useTranslation } from "react-i18next";

interface Item {
  id: number;
  name: string;
  unit: string;
  quantity: number;
  threshold: number;
}

export default function StockPage() {
  const { t } = useTranslation();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
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

  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

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
          className="bg-primary text-beige px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary transition-colors"
        >
          + Add Item
        </button>
      </div>

      {/* Add Item Form */}
      {showForm && (
        <div className="bg-primary/10 border border-primary/30 rounded-xl p-6 flex flex-col gap-4">
          <h3 className="text-beige font-semibold">New Item</h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="Item name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="bg-sidebar border border-primary/30 text-beige placeholder:text-soft/40 rounded-lg px-4 py-2 text-sm outline-none focus:border-secondary"
            />
            <input
              placeholder="Unit (e.g. bags, kg, pcs)"
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              className="bg-sidebar border border-primary/30 text-beige placeholder:text-soft/40 rounded-lg px-4 py-2 text-sm outline-none focus:border-secondary"
            />
            <input
              type="number"
              placeholder="Initial quantity"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
              className="bg-sidebar border border-primary/30 text-beige placeholder:text-soft/40 rounded-lg px-4 py-2 text-sm outline-none focus:border-secondary"
            />
            <input
              type="number"
              placeholder="Low stock threshold"
              value={form.threshold}
              onChange={(e) => setForm({ ...form, threshold: Number(e.target.value) })}
              className="bg-sidebar border border-primary/30 text-beige placeholder:text-soft/40 rounded-lg px-4 py-2 text-sm outline-none focus:border-secondary"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleAddItem}
              className="bg-primary text-beige px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary transition-colors"
            >
              Save Item
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="border border-primary/30 text-soft px-4 py-2 rounded-lg text-sm hover:bg-primary/10 transition-colors"
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
        className="bg-primary/10 border border-primary/30 text-beige placeholder:text-soft/40 rounded-lg px-4 py-2 text-sm outline-none focus:border-secondary w-full max-w-sm"
      />

      {/* Items Table */}
      <div className="bg-primary/10 border border-primary/30 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-primary/30">
              <th className="text-left text-soft px-6 py-4 font-medium">Item</th>
              <th className="text-left text-soft px-6 py-4 font-medium">Unit</th>
              <th className="text-left text-soft px-6 py-4 font-medium">Quantity</th>
              <th className="text-left text-soft px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center text-soft py-8">
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center text-soft py-8">
                  No items found.
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id} className="border-b border-primary/10 hover:bg-primary/10 transition-colors">
                  <td className="px-6 py-4 text-beige font-medium">{item.name}</td>
                  <td className="px-6 py-4 text-soft">{item.unit}</td>
                  <td className="px-6 py-4 text-beige">{item.quantity}</td>
                  <td className="px-6 py-4">
                    {item.quantity <= item.threshold ? (
                      <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs">
                        Low Stock
                      </span>
                    ) : (
                      <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">
                        In Stock
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
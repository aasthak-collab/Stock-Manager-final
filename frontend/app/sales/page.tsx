"use client";

import { useEffect, useState } from "react";
import api from "../../libraries/axios";

interface Item {
  id: number;
  name: string;
  unit: string;
  quantity: number;
}

interface Sale {
  id: number;
  quantity: number;
  rate: number;
  total: number;
  date: string;
  item: { name: string; unit: string };
  buyer: { name: string };
}

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    itemId: "",
    buyerName: "",
    quantity: 0,
    rate: 0,
  });

  const fetchSales = async () => {
    try {
      const res = await api.get("/api/sales");
      setSales(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchItems = async () => {
    try {
      const res = await api.get("/api/stock");
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSales();
    fetchItems();
  }, []);

  const handleAddSale = async () => {
    setError("");
    try {
      await api.post("/api/sales", {
        ...form,
        itemId: parseInt(form.itemId),
        quantity: Number(form.quantity),
        rate: Number(form.rate),
      });
      setForm({ itemId: "", buyerName: "", quantity: 0, rate: 0 });
      setShowForm(false);
      fetchSales();
      fetchItems();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create sale");
    }
  };

  const selectedItem = items.find((i) => i.id === parseInt(form.itemId));

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-beige text-2xl font-bold">Sales</h2>
          <p className="text-soft text-sm mt-1">Track all outgoing sales</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-secondary transition-colors"
        >
          + New Sale
        </button>
      </div>

      {/* Add Sale Form */}
      {showForm && (
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
          <h3 className="text-beige font-semibold">New Sale Entry</h3>
          <div className="grid grid-cols-2 gap-4">
            {/* Item Dropdown */}
            <div className="flex flex-col gap-1">
              <label className="text-soft text-xs">Item</label>
              <select
                value={form.itemId}
                onChange={(e) => setForm({ ...form, itemId: e.target.value })}
                className="bg-gray-50 border border-gray-200 text-beige rounded-xl px-4 py-2 text-sm outline-none focus:border-primary"
              >
                <option value="">Select item</option>
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} (Available: {item.quantity} {item.unit})
                  </option>
                ))}
              </select>
            </div>

            {/* Buyer */}
            <div className="flex flex-col gap-1">
              <label className="text-soft text-xs">Buyer Name</label>
              <input
                placeholder="Enter buyer name"
                value={form.buyerName}
                onChange={(e) => setForm({ ...form, buyerName: e.target.value })}
                className="bg-gray-50 border border-gray-200 text-beige placeholder:text-soft/40 rounded-xl px-4 py-2 text-sm outline-none focus:border-primary"
              />
            </div>

            {/* Quantity */}
            <div className="flex flex-col gap-1">
              <label className="text-soft text-xs">
                Quantity {selectedItem && `(max: ${selectedItem.quantity})`}
              </label>
              <input
                type="number"
                placeholder="Enter quantity"
                value={form.quantity || ""}
                onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                className="bg-gray-50 border border-gray-200 text-beige placeholder:text-soft/40 rounded-xl px-4 py-2 text-sm outline-none focus:border-primary"
              />
            </div>

            {/* Rate */}
            <div className="flex flex-col gap-1">
              <label className="text-soft text-xs">Rate (₹ per unit)</label>
              <input
                type="number"
                placeholder="Enter rate"
                value={form.rate || ""}
                onChange={(e) => setForm({ ...form, rate: Number(e.target.value) })}
                className="bg-gray-50 border border-gray-200 text-beige placeholder:text-soft/40 rounded-xl px-4 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Amount Preview */}
          {form.quantity > 0 && form.rate > 0 && (
            <div className="bg-green-50 rounded-xl px-4 py-3">
              <p className="text-green-600 text-sm font-medium">
                Total Amount: ₹{(form.quantity * form.rate).toLocaleString()}
              </p>
            </div>
          )}

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <div className="flex gap-3">
            <button
              onClick={handleAddSale}
              className="bg-primary text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-secondary transition-colors"
            >
              Save Sale
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

      {/* Sales Table */}
      <div className="bg-card rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left text-soft px-6 py-4 font-medium">Item</th>
              <th className="text-left text-soft px-6 py-4 font-medium">Buyer</th>
              <th className="text-left text-soft px-6 py-4 font-medium">Quantity</th>
              <th className="text-left text-soft px-6 py-4 font-medium">Rate</th>
              <th className="text-left text-soft px-6 py-4 font-medium">Amount</th>
              <th className="text-left text-soft px-6 py-4 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center text-soft py-8">Loading...</td>
              </tr>
            ) : sales.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-soft py-8">No sales yet.</td>
              </tr>
            ) : (
              sales.map((s) => (
                <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-beige font-medium">{s.item.name}</td>
                  <td className="px-6 py-4 text-soft">{s.buyer.name}</td>
                  <td className="px-6 py-4 text-beige">{s.quantity} {s.item.unit}</td>
                  <td className="px-6 py-4 text-soft">₹{s.rate}</td>
                  <td className="px-6 py-4 text-beige font-medium">₹{s.total.toLocaleString()}</td>
                  <td className="px-6 py-4 text-soft">
                    {new Date(s.date).toLocaleDateString("en-IN")}
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
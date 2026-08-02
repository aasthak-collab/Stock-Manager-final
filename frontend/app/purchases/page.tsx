"use client";

import { useEffect, useState } from "react";
import api from "../../libraries/axios";

interface Item {
  id: number;
  name: string;
  unit: string;
}

interface Purchase {
  id: number;
  quantity: number;
  rate: number;
  total: number;
  invoice: string;
  date: string;
  item: { name: string; unit: string };
  supplier: { name: string };
}

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    itemId: "",
    supplierName: "",
    quantity: 0,
    rate: 0,
    invoice: "",
  });

  const fetchPurchases = async () => {
    try {
      const res = await api.get("/api/purchases");
      setPurchases(res.data);
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
    fetchPurchases();
    fetchItems();
  }, []);

  const handleAddPurchase = async () => {
    try {
      await api.post("/api/purchases", {
        ...form,
        itemId: parseInt(form.itemId),
        quantity: Number(form.quantity),
        rate: Number(form.rate),
      });
      setForm({ itemId: "", supplierName: "", quantity: 0, rate: 0, invoice: "" });
      setShowForm(false);
      fetchPurchases();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-beige text-2xl font-bold">Purchases</h2>
          <p className="text-soft text-sm mt-1">Track all incoming stock purchases</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-secondary transition-colors"
        >
          + New Purchase
        </button>
      </div>

      {/* Add Purchase Form */}
      {showForm && (
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
          <h3 className="text-beige font-semibold">New Purchase Entry</h3>
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
                    {item.name} ({item.unit})
                  </option>
                ))}
              </select>
            </div>

            {/* Supplier */}
            <div className="flex flex-col gap-1">
              <label className="text-soft text-xs">Supplier Name</label>
              <input
                placeholder="Enter supplier name"
                value={form.supplierName}
                onChange={(e) => setForm({ ...form, supplierName: e.target.value })}
                className="bg-gray-50 border border-gray-200 text-beige placeholder:text-soft/40 rounded-xl px-4 py-2 text-sm outline-none focus:border-primary"
              />
            </div>

            {/* Quantity */}
            <div className="flex flex-col gap-1">
             <label className="text-soft text-xs">Quantity</label>
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

{/* Invoice */}
<div className="flex flex-col gap-1 col-span-2">
  <label className="text-soft text-xs">Invoice Number</label>
  <input
    placeholder="e.g. INV-001"
    value={form.invoice}
    onChange={(e) => setForm({ ...form, invoice: e.target.value })}
    className="bg-gray-50 border border-gray-200 text-beige placeholder:text-soft/40 rounded-xl px-4 py-2 text-sm outline-none focus:border-primary"
  />
</div>

          {/* Amount Preview */}
          {form.quantity > 0 && form.rate > 0 && (
            <div className="bg-blue-50 rounded-xl px-4 py-3">
              <p className="text-primary text-sm font-medium">
                Total Amount: ₹{(form.quantity * form.rate).toLocaleString()}
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleAddPurchase}
              className="bg-primary text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-secondary transition-colors"
            >
              Save Purchase
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

      {/* Purchases Table */}
      <div className="bg-card rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left text-soft px-6 py-4 font-medium">Item</th>
              <th className="text-left text-soft px-6 py-4 font-medium">Supplier</th>
              <th className="text-left text-soft px-6 py-4 font-medium">Quantity</th>
              <th className="text-left text-soft px-6 py-4 font-medium">Rate</th>
              <th className="text-left text-soft px-6 py-4 font-medium">Amount</th>
              <th className="text-left text-soft px-6 py-4 font-medium">Invoice</th>
              <th className="text-left text-soft px-6 py-4 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center text-soft py-8">Loading...</td>
              </tr>
            ) : purchases.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-soft py-8">No purchases yet.</td>
              </tr>
            ) : (
              purchases.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-beige font-medium">{p.item.name}</td>
                  <td className="px-6 py-4 text-soft">{p.supplier.name}</td>
                  <td className="px-6 py-4 text-beige">{p.quantity} {p.item.unit}</td>
                  <td className="px-6 py-4 text-soft">₹{p.rate}</td>
                  <td className="px-6 py-4 text-beige font-medium">₹{p.total.toLocaleString()}</td>
                  <td className="px-6 py-4 text-soft">{p.invoice || "—"}</td>
                  <td className="px-6 py-4 text-soft">
                    {new Date(p.date).toLocaleDateString("en-IN")}
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
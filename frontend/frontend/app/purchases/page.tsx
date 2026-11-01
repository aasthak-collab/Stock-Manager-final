"use client";

import { useEffect, useState } from "react";
import api from "../../libraries/axios";
import { Plus, Trash2 } from "lucide-react";

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

interface PurchaseRow {
  itemId: string;
  quantity: number;
  rate: number;
}

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [supplierName, setSupplierName] = useState("");
  const [invoice, setInvoice] = useState("");
  const [rows, setRows] = useState<PurchaseRow[]>([
    { itemId: "", quantity: 0, rate: 0 },
  ]);

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

  const addRow = () => {
    setRows([...rows, { itemId: "", quantity: 0, rate: 0 }]);
  };

  const removeRow = (index: number) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const updateRow = (index: number, field: keyof PurchaseRow, value: string | number) => {
    const updated = [...rows];
    updated[index] = { ...updated[index], [field]: value };
    setRows(updated);
  };

  const totalAmount = rows.reduce((sum, r) => sum + (r.quantity * r.rate), 0);

  const handleAddPurchase = async () => {
    try {
      // Submit each row as a separate purchase with same supplier and invoice
      for (const row of rows) {
        if (!row.itemId || !row.quantity || !row.rate) continue;
        await api.post("/api/purchases", {
          itemId: parseInt(row.itemId),
          supplierName,
          quantity: Number(row.quantity),
          rate: Number(row.rate),
          invoice,
        });
      }
      setRows([{ itemId: "", quantity: 0, rate: 0 }]);
      setSupplierName("");
      setInvoice("");
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

          {/* Supplier + Invoice */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-soft text-xs">Supplier Name</label>
              <input
                placeholder="Enter supplier name"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                className="bg-gray-50 border border-gray-200 text-beige placeholder:text-soft/40 rounded-xl px-4 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-soft text-xs">Invoice Number</label>
              <input
                placeholder="e.g. INV-001"
                value={invoice}
                onChange={(e) => setInvoice(e.target.value)}
                className="bg-gray-50 border border-gray-200 text-beige placeholder:text-soft/40 rounded-xl px-4 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Item Rows */}
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-12 gap-2 px-1">
              <p className="col-span-5 text-soft text-xs">Item</p>
              <p className="col-span-2 text-soft text-xs">Quantity</p>
              <p className="col-span-2 text-soft text-xs">Rate (₹)</p>
              <p className="col-span-2 text-soft text-xs">Amount</p>
              <p className="col-span-1"></p>
            </div>

            {rows.map((row, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-5">
                  <select
                    value={row.itemId}
                    onChange={(e) => updateRow(index, "itemId", e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-beige rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
                  >
                    <option value="">Select item</option>
                    {items.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} ({item.unit})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    placeholder="0"
                    value={row.quantity || ""}
                    onChange={(e) => updateRow(index, "quantity", Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 text-beige placeholder:text-soft/40 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    placeholder="0"
                    value={row.rate || ""}
                    onChange={(e) => updateRow(index, "rate", Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 text-beige placeholder:text-soft/40 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div className="col-span-2">
                  <p className="text-beige text-sm font-medium px-1">
                    ₹{(row.quantity * row.rate).toLocaleString()}
                  </p>
                </div>
                <div className="col-span-1 flex justify-center">
                  {rows.length > 1 && (
                    <button
                      onClick={() => removeRow(index)}
                      className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={13} className="text-red-500" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add Row Button */}
          <button
            onClick={addRow}
            className="flex items-center gap-2 text-primary text-sm hover:underline w-fit"
          >
            <Plus size={14} />
            Add another item
          </button>

          {/* Total */}
          <div className="bg-blue-50 rounded-xl px-4 py-3 flex items-center justify-between">
            <p className="text-soft text-sm">Total Amount</p>
            <p className="text-primary font-bold text-lg">
              ₹{totalAmount.toLocaleString()}
            </p>
          </div>

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
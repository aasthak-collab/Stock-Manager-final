"use client";

import { useEffect, useState } from "react";
import api from "../../libraries/axios";
import { Phone, MapPin, ChevronDown, ChevronUp, Edit2 } from "lucide-react";

interface Purchase {
  id: number;
  quantity: number;
  rate: number;
  total: number;
  date: string;
  invoice: string;
  item: { name: string; unit: string };
}

interface Supplier {
  id: number;
  name: string;
  phone: string;
  address: string;
  purchases: Purchase[];
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [editing, setEditing] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ phone: "", address: "" });

  const fetchSuppliers = async () => {
    try {
      const res = await api.get("/api/suppliers");
      setSuppliers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleEdit = (supplier: Supplier) => {
    setEditing(supplier.id);
    setEditForm({ phone: supplier.phone || "", address: supplier.address || "" });
  };

  const handleSaveEdit = async (id: number) => {
    try {
      await api.patch(`/api/suppliers/${id}`, editForm);
      setEditing(null);
      fetchSuppliers();
    } catch (err) {
      console.error(err);
    }
  };

  const getTotalSpend = (purchases: Purchase[]) =>
    purchases.reduce((sum, p) => sum + p.total, 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-beige text-2xl font-bold">Supplier Directory</h2>
        <p className="text-soft text-sm mt-1">
          All suppliers with contact info and purchase history
        </p>
      </div>

      {/* Suppliers List */}
      {loading ? (
        <p className="text-soft text-sm">Loading...</p>
      ) : suppliers.length === 0 ? (
        <div className="bg-card rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
          <p className="text-soft text-sm">
            No suppliers yet. They appear automatically when you add purchases.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {suppliers.map((supplier) => (
            <div
              key={supplier.id}
              className="bg-card rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Supplier Header */}
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-primary font-bold text-sm">
                    {supplier.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-beige font-semibold">{supplier.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      {supplier.phone && (
                        <span className="flex items-center gap-1 text-soft text-xs">
                          <Phone size={12} /> {supplier.phone}
                        </span>
                      )}
                      {supplier.address && (
                        <span className="flex items-center gap-1 text-soft text-xs">
                          <MapPin size={12} /> {supplier.address}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-beige font-semibold">
                      ₹{getTotalSpend(supplier.purchases).toLocaleString()}
                    </p>
                    <p className="text-soft text-xs">
                      {supplier.purchases.length} orders
                    </p>
                  </div>
                  <button
                    onClick={() => handleEdit(supplier)}
                    className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <Edit2 size={14} className="text-soft" />
                  </button>
                  <button
                    onClick={() => setExpanded(expanded === supplier.id ? null : supplier.id)}
                    className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    {expanded === supplier.id
                      ? <ChevronUp size={14} className="text-soft" />
                      : <ChevronDown size={14} className="text-soft" />
                    }
                  </button>
                </div>
              </div>

              {/* Edit Form */}
              {editing === supplier.id && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3 items-end">
                  <div className="flex flex-col gap-1 flex-1">
                    <label className="text-soft text-xs">Phone</label>
                    <input
                      placeholder="Enter phone number"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="bg-white border border-gray-200 text-beige placeholder:text-soft/40 rounded-xl px-4 py-2 text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <label className="text-soft text-xs">Address</label>
                    <input
                      placeholder="Enter address"
                      value={editForm.address}
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      className="bg-white border border-gray-200 text-beige placeholder:text-soft/40 rounded-xl px-4 py-2 text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <button
                    onClick={() => handleSaveEdit(supplier.id)}
                    className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-secondary transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditing(null)}
                    className="border border-gray-200 text-soft px-4 py-2 rounded-xl text-sm hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Purchase History */}
              {expanded === supplier.id && (
                <div className="border-t border-gray-100">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="text-left text-soft px-6 py-3 font-medium">Item</th>
                        <th className="text-left text-soft px-6 py-3 font-medium">Quantity</th>
                        <th className="text-left text-soft px-6 py-3 font-medium">Rate</th>
                        <th className="text-left text-soft px-6 py-3 font-medium">Amount</th>
                        <th className="text-left text-soft px-6 py-3 font-medium">Invoice</th>
                        <th className="text-left text-soft px-6 py-3 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {supplier.purchases.map((p) => (
                        <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="px-6 py-3 text-beige">{p.item.name}</td>
                          <td className="px-6 py-3 text-soft">{p.quantity} {p.item.unit}</td>
                          <td className="px-6 py-3 text-soft">₹{p.rate}</td>
                          <td className="px-6 py-3 text-beige font-medium">₹{p.total.toLocaleString()}</td>
                          <td className="px-6 py-3 text-soft">{p.invoice || "—"}</td>
                          <td className="px-6 py-3 text-soft">
                            {new Date(p.date).toLocaleDateString("en-IN")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
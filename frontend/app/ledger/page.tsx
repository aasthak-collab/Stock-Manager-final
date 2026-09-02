"use client";

import { useEffect, useState } from "react";
import api from "../../libraries/axios";
import { TrendingUp, TrendingDown, Wallet, Plus } from "lucide-react";

interface LedgerEntry {
  id: number;
  type: string;
  amount: number;
  description: string;
  date: string;
  refType: string;
}

interface LedgerData {
  entries: LedgerEntry[];
  totalCredit: number;
  totalDebit: number;
  balance: number;
}

export default function LedgerPage() {
  const [data, setData] = useState<LedgerData>({
    entries: [],
    totalCredit: 0,
    totalDebit: 0,
    balance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    type: "CREDIT",
    amount: "",
    description: "",
  });

  const fetchLedger = async () => {
    try {
      const res = await api.get("/api/ledger");
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedger();
  }, []);

  const handleAddEntry = async () => {
    if (!form.amount || Number(form.amount) <= 0) return;
    try {
      await api.post("/api/ledger", {
        ...form,
        amount: Number(form.amount),
      });
      setForm({ type: "CREDIT", amount: "", description: "" });
      setShowForm(false);
      fetchLedger();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-beige text-2xl font-bold">Payment Ledger</h2>
          <p className="text-soft text-sm mt-1">
            Complete financial record of all transactions
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-secondary transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          Manual Entry
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <p className="text-soft text-sm">Total Income</p>
            <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
              <TrendingUp size={18} className="text-green-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-beige">
            ₹{data.totalCredit.toLocaleString()}
          </p>
          <p className="text-soft text-xs mt-1">Total credits</p>
        </div>

        <div className="bg-card rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <p className="text-soft text-sm">Total Expenses</p>
            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
              <TrendingDown size={18} className="text-red-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-beige">
            ₹{data.totalDebit.toLocaleString()}
          </p>
          <p className="text-soft text-xs mt-1">Total debits</p>
        </div>

        <div className="bg-card rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <p className="text-soft text-sm">Net Balance</p>
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
              <Wallet size={18} className="text-primary" />
            </div>
          </div>
          <p className={`text-2xl font-bold ${data.balance >= 0 ? "text-green-500" : "text-red-500"}`}>
            ₹{data.balance.toLocaleString()}
          </p>
          <p className="text-soft text-xs mt-1">Current balance</p>
        </div>
      </div>

      {/* Manual Entry Form */}
      {showForm && (
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
          <h3 className="text-beige font-semibold">Manual Ledger Entry</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-soft text-xs">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="bg-gray-50 border border-gray-200 text-beige rounded-xl px-4 py-2 text-sm outline-none focus:border-primary"
              >
                <option value="CREDIT">Credit (Money In)</option>
                <option value="DEBIT">Debit (Money Out)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-soft text-xs">Amount (₹)</label>
              <input
                type="number"
                placeholder="Enter amount"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="bg-gray-50 border border-gray-200 text-beige placeholder:text-soft/40 rounded-xl px-4 py-2 text-sm outline-none focus:border-primary"
              />
            </div>

            <div className="flex flex-col gap-1 col-span-2">
              <label className="text-soft text-xs">Description</label>
              <input
                placeholder="e.g. Payment received from buyer"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="bg-gray-50 border border-gray-200 text-beige placeholder:text-soft/40 rounded-xl px-4 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAddEntry}
              className="bg-primary text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-secondary transition-colors"
            >
              Save Entry
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

      {/* Ledger Table - Excel style */}
      <div className="bg-card rounded-2xl shadow-sm border border-gray-300 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left text-beige px-4 py-3 font-semibold border border-gray-300">Date</th>
                <th className="text-left text-beige px-4 py-3 font-semibold border border-gray-300">Description</th>
                <th className="text-left text-beige px-4 py-3 font-semibold border border-gray-300">Type</th>
                <th className="text-left text-beige px-4 py-3 font-semibold border border-gray-300">Reference</th>
                <th className="text-right text-beige px-4 py-3 font-semibold border border-gray-300">Amount</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center text-soft py-8 border border-gray-300">Loading...</td>
                </tr>
              ) : data.entries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-soft py-8 border border-gray-300">
                    No entries yet. They appear automatically when you make sales or purchases.
                  </td>
                </tr>
              ) : (
                data.entries.map((entry, idx) => (
                  <tr
                    key={entry.id}
                    className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition-colors`}
                  >
                    <td className="px-4 py-3 text-soft border border-gray-300">
                      {new Date(entry.date).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-3 text-beige border border-gray-300">{entry.description}</td>
                    <td className="px-4 py-3 border border-gray-300">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          entry.type === "CREDIT"
                            ? "bg-green-50 text-green-600"
                            : "bg-red-50 text-red-500"
                        }`}
                      >
                        {entry.type === "CREDIT" ? "Credit" : "Debit"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-soft text-xs border border-gray-300">{entry.refType}</td>
                    <td className={`px-4 py-3 font-medium text-right border border-gray-300 ${
                      entry.type === "CREDIT" ? "text-green-600" : "text-red-500"
                    }`}>
                      {entry.type === "CREDIT" ? "+" : "-"}₹{entry.amount.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {data.entries.length > 0 && (
              <tfoot>
                <tr className="bg-gray-100 font-semibold">
                  <td colSpan={4} className="px-4 py-3 text-right text-beige border border-gray-300">
                    Net Balance
                  </td>
                  <td className={`px-4 py-3 text-right border border-gray-300 ${data.balance >= 0 ? "text-green-600" : "text-red-500"}`}>
                    ₹{data.balance.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
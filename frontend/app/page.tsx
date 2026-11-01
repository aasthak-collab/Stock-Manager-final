"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "../libraries/axios";
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { Package, AlertTriangle, ArrowDownLeft, ArrowUpRight, TrendingUp, Wallet, PackageX, Boxes } from "lucide-react";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const rs = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

export default function Home() {
  const [sales, setSales] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [ledger, setLedger] = useState<any>({ totalCredit: 0, totalDebit: 0 });

  useEffect(() => {
    // Load everything the dashboard needs
    const load = async () => {
      try {
        const [s, p, i, l] = await Promise.all([
          api.get("/api/sales"),
          api.get("/api/purchases"),
          api.get("/api/stock"),
          api.get("/api/ledger"),
        ]);
        setSales(s.data);
        setPurchases(p.data);
        setItems(i.data);
        setLedger(l.data);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  const year = new Date().getFullYear();
  const totalSales = sales.reduce((a, s) => a + s.total, 0);
  const totalPurchases = purchases.reduce((a, p) => a + p.total, 0);
  const lowItems = items.filter((i) => i.quantity <= i.threshold);
  const outItems = items.filter((i) => i.quantity === 0);

  // Sales per month for the chart
  const chart = MONTHS.map((m, idx) => ({
    month: m,
    total: sales
      .filter((s) => new Date(s.date).getFullYear() === year && new Date(s.date).getMonth() === idx)
      .reduce((a, s) => a + s.total, 0),
  }));

  // Latest 5 sales + purchases mixed together
  const recent = [
    ...sales.map((s) => ({ id: "s" + s.id, kind: "sale", label: "Sale to " + s.buyer.name, amount: s.total, date: s.date })),
    ...purchases.map((p) => ({ id: "p" + p.id, kind: "purchase", label: "Purchase from " + p.supplier.name, amount: p.total, date: p.date })),
  ]
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .slice(0, 5);

  const card = "bg-card rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100";

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Big sales chart */}
        <div className={`${card} lg:col-span-2`}>
          <p className="text-soft text-sm">Total Sales</p>
          <p className="text-2xl font-bold text-green-600">{rs(totalSales)}</p>
          <div className="h-52 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chart}>
                <defs>
                  <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} width={45} />
                <Tooltip formatter={(v) => [rs(Number(v ?? 0)), "Sales"]} />
                <Area type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={2} fill="url(#fill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side summary cards */}
        <div className={`${card} flex flex-col gap-3 justify-center`}>
          {[
            { label: "Sales", value: totalSales, icon: TrendingUp, bg: "bg-blue-50", color: "text-blue-500" },
            { label: "Purchases", value: totalPurchases, icon: ArrowDownLeft, bg: "bg-green-50", color: "text-green-500" },
            { label: "Net Balance", value: ledger.totalCredit - ledger.totalDebit, icon: Wallet, bg: "bg-red-50", color: "text-red-500" },
          ].map((c) => (
            <div key={c.label} className="flex items-center gap-3 border-b border-gray-50 last:border-0 pb-3 last:pb-0">
              <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center`}>
                <c.icon size={20} className={c.color} />
              </div>
              <div>
                <p className="text-soft text-xs">{c.label}</p>
                <p className="text-beige font-bold">{rs(c.value)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Inventory overview: stock-only metrics */}
        <div className={`${card} lg:col-span-2`}>
          <p className="text-beige font-semibold mb-3">Inventory Overview</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Total Items", value: items.length, icon: Boxes, bg: "bg-purple-50", color: "text-purple-500" },
              { label: "Low Stock Items", value: lowItems.length, icon: AlertTriangle, bg: "bg-orange-50", color: "text-orange-500" },
              { label: "Out of Stock", value: outItems.length, icon: PackageX, bg: "bg-red-50", color: "text-red-500" },
              { label: "In Stock", value: items.length - lowItems.length, icon: Package, bg: "bg-green-50", color: "text-green-500" },
            ].map((c) => (
              <div key={c.label} className="border border-gray-100 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="text-soft text-xs">{c.label}</p>
                  <p className="text-beige text-xl font-bold">{c.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-full ${c.bg} flex items-center justify-center`}>
                  <c.icon size={18} className={c.color} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Income / expense blocks */}
        <div className="flex flex-col gap-3">
          <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex justify-between items-center">
            <div>
              <p className="text-soft text-xs">Total Income</p>
              <p className="text-green-600 text-xl font-bold">{rs(ledger.totalCredit)}</p>
            </div>
            <ArrowDownLeft className="text-green-500" />
          </div>
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex justify-between items-center">
            <div>
              <p className="text-soft text-xs">Total Expenses</p>
              <p className="text-red-500 text-xl font-bold">{rs(ledger.totalDebit)}</p>
            </div>
            <ArrowUpRight className="text-red-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Stock summary table */}
        <div className={card}>
          <div className="flex justify-between mb-3">
            <p className="text-beige font-semibold">Stock Summary</p>
            <Link href="/stock" className="text-primary text-xs">View All</Link>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-soft text-xs text-left">
                <th className="py-2">Item</th>
                <th>In Stock</th>
                <th>Min</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {items.slice(0, 5).map((i) => (
                <tr key={i.id} className="border-t border-gray-50">
                  <td className="py-2 text-beige">{i.name}</td>
                  <td>{i.quantity} {i.unit}</td>
                  <td className="text-soft">{i.threshold}</td>
                  <td>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${i.quantity <= i.threshold ? "bg-red-50 text-red-500" : "bg-green-50 text-green-600"}`}>
                      {i.quantity <= i.threshold ? "Low" : "OK"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent transactions */}
        <div className={card}>
          <div className="flex justify-between mb-3">
            <p className="text-beige font-semibold">Recent Transactions</p>
            <Link href="/ledger" className="text-primary text-xs">View All</Link>
          </div>
          {recent.length === 0 ? (
            <p className="text-soft text-sm">No transactions yet.</p>
          ) : (
            recent.map((r) => (
              <div key={r.id} className="flex items-center gap-3 py-2 border-t border-gray-50">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${r.kind === "sale" ? "bg-blue-50 text-blue-500" : "bg-green-50 text-green-500"}`}>
                  {r.kind === "sale" ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-beige text-sm truncate">{r.label}</p>
                  <p className="text-soft text-xs">{new Date(r.date).toLocaleDateString("en-IN")}</p>
                </div>
                <p className="text-beige text-sm font-medium">{rs(r.amount)}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
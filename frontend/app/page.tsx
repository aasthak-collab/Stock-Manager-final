"use client";

import { useEffect, useState } from "react";
import api from "../libraries/axios";
import {
  Package,
  TrendingUp,
  AlertTriangle,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface DashboardData {
  totalItems: number;
  todaysSalesTotal: number;
  todaysSalesCount: number;
  lowStockCount: number;
  balance: number;
  recentActivity: {
    id: number;
    type: string;
    amount: number;
    description: string;
    date: string;
    refType: string;
  }[];
}

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/api/dashboard");
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const stats = data
    ? [
        {
          label: "Total Items",
          value: String(data.totalItems),
          sub: "in stock",
          icon: Package,
          colorClass: "text-blue-500",
          lightClass: "bg-blue-50",
          up: true,
        },
        {
          label: "Today's Sales",
          value: "Rs." + data.todaysSalesTotal.toLocaleString(),
          sub: data.todaysSalesCount + " transactions",
          icon: TrendingUp,
          colorClass: "text-orange-500",
          lightClass: "bg-orange-50",
          up: true,
        },
        {
          label: "Low Stock Alerts",
          value: String(data.lowStockCount),
          sub: "items below limit",
          icon: AlertTriangle,
          colorClass: "text-red-500",
          lightClass: "bg-red-50",
          up: false,
        },
        {
          label: "Net Balance",
          value: "Rs." + data.balance.toLocaleString(),
          sub: "total ledger balance",
          icon: Wallet,
          colorClass: "text-green-500",
          lightClass: "bg-green-50",
          up: data.balance >= 0,
        },
      ]
    : [];

  const quickLinks = [
    { label: "Add Stock", colorClass: "bg-blue-500", href: "/stock" },
    { label: "New Sale", colorClass: "bg-orange-500", href: "/sales" },
    { label: "Attendance", colorClass: "bg-purple-500", href: "/attendance" },
    { label: "Ledger", colorClass: "bg-green-500", href: "/ledger" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-beige text-2xl font-bold">Dashboard</h2>
        <p className="text-soft text-sm mt-1">
          Overview of your stock and operations
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? [0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-card rounded-2xl p-5 border border-gray-100 shadow-sm animate-pulse h-32"
              />
            ))
          : stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="bg-card rounded-2xl p-5 flex flex-col gap-3 shadow-sm border border-gray-100"
                >
                  <div className="flex items-center justify-between">
                    <div className={"w-10 h-10 rounded-xl " + stat.lightClass + " flex items-center justify-center"}>
                      <Icon size={20} className={stat.colorClass} />
                    </div>
                    {stat.up ? (
                      <ArrowUpRight size={16} className="text-green-500" />
                    ) : (
                      <ArrowDownRight size={16} className="text-red-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-beige text-2xl font-bold">{stat.value}</p>
                    <p className="text-soft text-xs mt-0.5">{stat.label}</p>
                  </div>
                </div>
              );
            })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-beige font-semibold mb-4">Recent Activity</h3>
          <div className="flex flex-col gap-2">
            {loading ? (
              <p className="text-soft text-sm">Loading...</p>
            ) : !data || data.recentActivity.length === 0 ? (
              <p className="text-soft text-sm">No transactions yet.</p>
            ) : (
              data.recentActivity.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  <div>
                    <p className="text-beige text-sm">{entry.description}</p>
                    <p className="text-soft text-xs mt-0.5">
                      {new Date(entry.date).toLocaleDateString("en-IN")} · {entry.refType}
                    </p>
                  </div>
                  <p className={"text-sm font-medium " + (entry.type === "CREDIT" ? "text-green-600" : "text-red-500")}>
                    {entry.type === "CREDIT" ? "+" : "-"}Rs.{entry.amount.toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-sm border border-gray-100">
  <h3 className="text-beige font-semibold mb-4">Quick Access</h3>
  <div className="grid grid-cols-2 gap-3">
    <a href="/stock" className="bg-blue-500 text-white rounded-xl py-4 text-sm font-medium hover:opacity-90 transition-opacity text-center block">Add Stock</a>
    <a href="/sales" className="bg-orange-500 text-white rounded-xl py-4 text-sm font-medium hover:opacity-90 transition-opacity text-center block">New Sale</a>
    <a href="/attendance" className="bg-purple-500 text-white rounded-xl py-4 text-sm font-medium hover:opacity-90 transition-opacity text-center block">Attendance</a>
    <a href="/ledger" className="bg-green-500 text-white rounded-xl py-4 text-sm font-medium hover:opacity-90 transition-opacity text-center block">Ledger</a>
  </div>
</div>
        </div>
      </div>
  );
}
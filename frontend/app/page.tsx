"use client";

import { useTranslation } from "react-i18next";
import {
  Package,
  TrendingUp,
  AlertTriangle,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const stats = [
  {
    label: "Total Items",
    value: "9",
    sub: "in stock",
    icon: Package,
    color: "bg-blue-500",
    light: "bg-blue-50",
    trend: "+12.5%",
    up: true,
  },
  {
    label: "Today's Sales",
    value: "₹0",
    sub: "0 transactions",
    icon: TrendingUp,
    color: "bg-orange-500",
    light: "bg-orange-50",
    trend: "+8.2%",
    up: true,
  },
  {
    label: "Low Stock Alerts",
    value: "9",
    sub: "items below limit",
    icon: AlertTriangle,
    color: "bg-purple-500",
    light: "bg-purple-50",
    trend: "+15.3%",
    up: false,
  },
  {
    label: "Pending Payments",
    value: "₹0",
    sub: "from buyers",
    icon: CreditCard,
    color: "bg-green-500",
    light: "bg-green-50",
    trend: "+5.7%",
    up: true,
  },
];

const recentActivity = [
  { label: "No transactions yet", time: "", type: "info" },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-beige text-2xl font-bold">Dashboard</h2>
        <p className="text-soft text-sm mt-1">
          Overview of your stock and operations
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-card rounded-2xl p-5 flex flex-col gap-3 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl ${stat.light} flex items-center justify-center`}>
                  <Icon size={20} className={stat.color.replace("bg-", "text-")} />
                </div>
                <span className={`text-xs font-medium flex items-center gap-1 ${stat.up ? "text-green-500" : "text-red-500"}`}>
                  {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {stat.trend}
                </span>
              </div>
              <div>
                <p className="text-beige text-2xl font-bold">{stat.value}</p>
                <p className="text-soft text-xs mt-0.5">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Activity */}
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-beige font-semibold mb-4">Recent Activity</h3>
          <div className="flex flex-col gap-3">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <p className="text-soft text-sm">{item.label}</p>
                <p className="text-soft/50 text-xs">{item.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Access */}
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-beige font-semibold mb-4">Quick Access</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Add Stock", color: "bg-blue-500" },
              { label: "New Sale", color: "bg-orange-500" },
              { label: "Attendance", color: "bg-purple-500" },
              { label: "Ledger", color: "bg-green-500" },
            ].map((item) => (
              <button
                key={item.label}
                className={`${item.color} text-white rounded-xl py-4 text-sm font-medium hover:opacity-90 transition-opacity`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import api from "../../libraries/axios";

interface AuditLog {
  id: number;
  action: string;
  module: string;
  details: string;
  userEmail: string;
  createdAt: string;
}

const moduleColors: Record<string, string> = {
  PURCHASE: "bg-blue-50 text-blue-600",
  SALE: "bg-green-50 text-green-600",
  STOCK: "bg-purple-50 text-purple-600",
  SALARY: "bg-orange-50 text-orange-600",
  MANUAL: "bg-gray-50 text-gray-600",
};

const actionColors: Record<string, string> = {
  CREATE: "bg-green-50 text-green-600",
  UPDATE: "bg-yellow-50 text-yellow-600",
  DELETE: "bg-red-50 text-red-500",
};

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  const fetchLogs = async () => {
    try {
      const res = await api.get("/api/audit");
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filtered = filter === "ALL"
    ? logs
    : logs.filter((l) => l.module === filter);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-beige text-2xl font-bold">Audit Log</h2>
          <p className="text-soft text-sm mt-1">
            Complete history of all changes made
          </p>
        </div>

        {/* Filter */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-card border border-gray-200 text-beige rounded-xl px-4 py-2 text-sm outline-none"
        >
          {["ALL", "PURCHASE", "SALE", "STOCK", "SALARY", "MANUAL"].map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>

      {/* Logs Table */}
      <div className="bg-card rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left text-soft px-6 py-4 font-medium">Time</th>
              <th className="text-left text-soft px-6 py-4 font-medium">Module</th>
              <th className="text-left text-soft px-6 py-4 font-medium">Action</th>
              <th className="text-left text-soft px-6 py-4 font-medium">Details</th>
              <th className="text-left text-soft px-6 py-4 font-medium">By</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center text-soft py-8">Loading...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-soft py-8">
                  No audit logs yet.
                </td>
              </tr>
            ) : (
              filtered.map((log) => (
                <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-4 text-soft text-xs">
                    {new Date(log.createdAt).toLocaleString("en-IN")}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${moduleColors[log.module] || "bg-gray-50 text-gray-600"}`}>
                      {log.module}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${actionColors[log.action] || "bg-gray-50 text-gray-600"}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-beige">{log.details}</td>
                  <td className="px-6 py-4 text-soft text-xs">{log.userEmail || "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
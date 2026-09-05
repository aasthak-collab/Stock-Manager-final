"use client";

import { useEffect, useState, useRef } from "react";
import api from "../../libraries/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Download } from "lucide-react";

interface Sale {
  total: number;
  date: string;
  item: { name: string };
  buyer: { name: string };
}

interface MonthlyData {
  month: string;
  total: number;
}

export default function AnalysisPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const reportRef = useRef<HTMLDivElement>(null);

  const fetchSales = async () => {
    try {
      const res = await api.get("/api/sales");
      setSales(res.data);
      processMonthlyData(res.data, selectedYear);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const processMonthlyData = (salesData: Sale[], year: number) => {
    // Group sales by month for selected year
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    const grouped = months.map((month, index) => {
      const total = salesData
        .filter((s) => {
          const d = new Date(s.date);
          return d.getFullYear() === year && d.getMonth() === index;
        })
        .reduce((sum, s) => sum + s.total, 0);
      return { month, total };
    });

    setMonthlyData(grouped);
  };

  useEffect(() => {
    fetchSales();
  }, []);

  useEffect(() => {
    processMonthlyData(sales, selectedYear);
  }, [selectedYear, sales]);

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    const { default: jsPDF } = await import("jspdf");
    const { default: html2canvas } = await import("html2canvas");
    const canvas = await html2canvas(reportRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("landscape", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save(`sales-report-${selectedYear}.pdf`);
  };

  const totalYearlySales = monthlyData.reduce((sum, m) => sum + m.total, 0);
  const bestMonth = monthlyData.reduce(
    (best, m) => (m.total > best.total ? m : best),
    { month: "-", total: 0 }
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-beige text-2xl font-bold">Sales Analysis</h2>
          <p className="text-soft text-sm mt-1">
            Monthly and yearly performance overview
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-card border border-gray-200 text-beige rounded-xl px-4 py-2 text-sm outline-none"
          >
            {[2024, 2025, 2026].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <button
            onClick={handleDownloadPDF}
            className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-secondary transition-colors flex items-center gap-2"
          >
            <Download size={16} />
            Download PDF
          </button>
        </div>
      </div>

      {/* Report Section */}
      <div ref={reportRef} className="flex flex-col gap-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-soft text-sm">Total Sales {selectedYear}</p>
            <p className="text-beige text-2xl font-bold mt-2">
              ₹{totalYearlySales.toLocaleString()}
            </p>
          </div>
          <div className="bg-card rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-soft text-sm">Best Month</p>
            <p className="text-beige text-2xl font-bold mt-2">{bestMonth.month}</p>
            <p className="text-soft text-xs mt-1">₹{bestMonth.total.toLocaleString()}</p>
          </div>
          <div className="bg-card rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-soft text-sm">Total Transactions</p>
            <p className="text-beige text-2xl font-bold mt-2">{sales.length}</p>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-beige font-semibold mb-6">Monthly Sales — {selectedYear}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748b" }} />
              <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
              <Tooltip
                formatter={(value: number) => [`₹${value.toLocaleString()}`, "Sales"]}
              />
              <Bar dataKey="total" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sales Table */}
        <div className="bg-card rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left text-soft px-6 py-4 font-medium">Date</th>
                <th className="text-left text-soft px-6 py-4 font-medium">Item</th>
                <th className="text-left text-soft px-6 py-4 font-medium">Buyer</th>
                <th className="text-left text-soft px-6 py-4 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center text-soft py-8">Loading...</td>
                </tr>
              ) : sales.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-soft py-8">No sales data yet.</td>
                </tr>
              ) : (
                sales
                  .filter((s) => new Date(s.date).getFullYear() === selectedYear)
                  .map((s, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-6 py-4 text-soft">
                        {new Date(s.date).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-6 py-4 text-beige">{s.item.name}</td>
                      <td className="px-6 py-4 text-soft">{s.buyer.name}</td>
                      <td className="px-6 py-4 text-beige font-medium">
                        ₹{s.total.toLocaleString()}
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
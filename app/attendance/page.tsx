"use client";

import { useEffect, useState } from "react";
import api from "../../libraries/axios";
import { UserPlus, IndianRupee } from "lucide-react";

interface Worker {
  id: number;
  name: string;
  phone: string;
  dailyRate: number;
}

interface AttendanceRecord {
  workerId: number;
  status: string;
  note: string;
  worker: { name: string };
}

export default function AttendancePage() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showWorkerForm, setShowWorkerForm] = useState(false);
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [salaryResult, setSalaryResult] = useState<any>(null);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [workerForm, setWorkerForm] = useState({
    name: "",
    phone: "",
    dailyRate: 0,
  });
  const [salaryForm, setSalaryForm] = useState({
    workerId: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const fetchWorkers = async () => {
    try {
      const res = await api.get("/api/attendance/workers");
      setWorkers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAttendance = async (date: string) => {
    try {
      const res = await api.get(`/api/attendance/date/${date}`);
      setAttendance(res.data);
      // Pre-fill notes from existing attendance
      const noteMap: Record<number, string> = {};
      res.data.forEach((a: AttendanceRecord) => {
        if (a.note) noteMap[a.workerId] = a.note;
      });
      setNotes(noteMap);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWorkers();
    fetchAttendance(selectedDate);
  }, []);

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    fetchAttendance(date);
  };

  const handleAddWorker = async () => {
    try {
      await api.post("/api/attendance/workers", {
        ...workerForm,
        dailyRate: Number(workerForm.dailyRate),
      });
      setWorkerForm({ name: "", phone: "", dailyRate: 0 });
      setShowWorkerForm(false);
      fetchWorkers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAttendance = async (workerId: number, status: string) => {
    try {
      await api.post("/api/attendance/mark", {
        workerId,
        date: selectedDate,
        status,
        note: notes[workerId] || "",
      });
      fetchAttendance(selectedDate);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePaySalary = async () => {
    try {
      const res = await api.post("/api/attendance/pay-salary", {
        ...salaryForm,
        workerId: Number(salaryForm.workerId),
      });
      setSalaryResult(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getStatus = (workerId: number) => {
    const record = attendance.find((a) => a.workerId === workerId);
    return record?.status || "ABSENT";
  };

  const statusColors: Record<string, string> = {
    PRESENT: "bg-green-500 text-white",
    HALF: "bg-yellow-500 text-white",
    ABSENT: "bg-red-500 text-white",
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-beige text-2xl font-bold">Attendance</h2>
          <p className="text-soft text-sm mt-1">
            Mark daily attendance and process salaries
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowSalaryModal(true)}
            className="border border-primary text-primary px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary/10 transition-colors flex items-center gap-2"
          >
            <IndianRupee size={16} />
            Pay Salary
          </button>
          <button
            onClick={() => setShowWorkerForm(!showWorkerForm)}
            className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-secondary transition-colors flex items-center gap-2"
          >
            <UserPlus size={16} />
            Add Worker
          </button>
        </div>
      </div>

      {/* Add Worker Form */}
      {showWorkerForm && (
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
          <h3 className="text-beige font-semibold">Add New Worker</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-soft text-xs">Worker Name</label>
              <input
                placeholder="Enter name"
                value={workerForm.name}
                onChange={(e) => setWorkerForm({ ...workerForm, name: e.target.value })}
                className="bg-gray-50 border border-gray-200 text-beige placeholder:text-soft/40 rounded-xl px-4 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-soft text-xs">Phone</label>
              <input
                placeholder="Enter phone"
                value={workerForm.phone}
                onChange={(e) => setWorkerForm({ ...workerForm, phone: e.target.value })}
                className="bg-gray-50 border border-gray-200 text-beige placeholder:text-soft/40 rounded-xl px-4 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-soft text-xs">Daily Rate (₹)</label>
              <input
                type="number"
                placeholder="Enter daily rate"
                value={workerForm.dailyRate || ""}
                onChange={(e) => setWorkerForm({ ...workerForm, dailyRate: Number(e.target.value) })}
                className="bg-gray-50 border border-gray-200 text-beige placeholder:text-soft/40 rounded-xl px-4 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleAddWorker}
              className="bg-primary text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-secondary transition-colors"
            >
              Save Worker
            </button>
            <button
              onClick={() => setShowWorkerForm(false)}
              className="border border-gray-200 text-soft px-5 py-2 rounded-xl text-sm hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Date Picker + Attendance Table */}
      <div className="bg-card rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-beige font-semibold">Daily Register</h3>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-beige rounded-xl px-4 py-2 text-sm outline-none focus:border-primary"
          />
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left text-soft px-4 py-3 font-medium">Worker</th>
              <th className="text-left text-soft px-4 py-3 font-medium">Daily Rate</th>
              <th className="text-left text-soft px-4 py-3 font-medium">Status</th>
              <th className="text-left text-soft px-4 py-3 font-medium">Mark</th>
              <th className="text-left text-soft px-4 py-3 font-medium">Note</th>
            </tr>
          </thead>
          <tbody>
            {workers.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-soft py-8">
                  No workers added yet.
                </td>
              </tr>
            ) : (
              workers.map((worker) => (
                <tr key={worker.id} className="border-b border-gray-50">
                  <td className="px-4 py-3 text-beige font-medium">{worker.name}</td>
                  <td className="px-4 py-3 text-soft">₹{worker.dailyRate}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[getStatus(worker.id)]}`}>
                      {getStatus(worker.id)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {["PRESENT", "HALF", "ABSENT"].map((status) => (
                        <button
                          key={status}
                          onClick={() => handleMarkAttendance(worker.id, status)}
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors border
                            ${getStatus(worker.id) === status
                              ? statusColors[status]
                              : "border-gray-200 text-soft hover:bg-gray-50"
                            }`}
                        >
                          {status === "PRESENT" ? "P" : status === "HALF" ? "H" : "A"}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      placeholder="Add note..."
                      value={notes[worker.id] || ""}
                      onChange={(e) => setNotes({ ...notes, [worker.id]: e.target.value })}
                      onBlur={() => {
                        const currentStatus = getStatus(worker.id);
                        if (currentStatus !== "ABSENT" || notes[worker.id]) {
                          handleMarkAttendance(worker.id, currentStatus);
                        }
                      }}
                      className="bg-gray-50 border border-gray-200 text-beige placeholder:text-soft/40 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-primary w-40"
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pay Salary Modal */}
      {showSalaryModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-card rounded-2xl p-6 shadow-xl w-full max-w-md flex flex-col gap-4">
            <h3 className="text-beige font-semibold text-lg">Process Monthly Salary</h3>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-soft text-xs">Worker</label>
                <select
                  value={salaryForm.workerId}
                  onChange={(e) => setSalaryForm({ ...salaryForm, workerId: e.target.value })}
                  className="bg-gray-50 border border-gray-200 text-beige rounded-xl px-4 py-2 text-sm outline-none"
                >
                  <option value="">Select worker</option>
                  {workers.map((w) => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-soft text-xs">Month</label>
                  <select
                    value={salaryForm.month}
                    onChange={(e) => setSalaryForm({ ...salaryForm, month: Number(e.target.value) })}
                    className="bg-gray-50 border border-gray-200 text-beige rounded-xl px-4 py-2 text-sm outline-none"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {new Date(0, i).toLocaleString("en", { month: "long" })}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-soft text-xs">Year</label>
                  <input
                    type="number"
                    value={salaryForm.year}
                    onChange={(e) => setSalaryForm({ ...salaryForm, year: Number(e.target.value) })}
                    className="bg-gray-50 border border-gray-200 text-beige rounded-xl px-4 py-2 text-sm outline-none"
                  />
                </div>
              </div>
            </div>

            {salaryResult && (
              <div className="bg-green-50 rounded-xl px-4 py-3">
                <p className="text-green-600 text-sm font-medium">
                  {salaryResult.worker} — {salaryResult.totalDays} days — ₹{salaryResult.salary} paid
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handlePaySalary}
                className="bg-primary text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-secondary transition-colors"
              >
                Calculate & Pay
              </button>
              <button
                onClick={() => { setShowSalaryModal(false); setSalaryResult(null); }}
                className="border border-gray-200 text-soft px-5 py-2 rounded-xl text-sm hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
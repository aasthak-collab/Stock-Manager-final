import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import stockRouter from "./routes/stock";
import purchasesRouter from "./routes/purchases";
import salesRouter from "./routes/sales";
import ledgerRouter from "./routes/ledger";
import attendanceRouter from "./routes/attendance";
import authRouter from "./routes/auth";
import suppliersRouter from "./routes/suppliers";
import settingsRouter from "./routes/settings";
import auditRouter from "./routes/audit";
import dashboardRouter from "./routes/dashboard";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    "http://localhost:3000",
    process.env.FRONTEND_URL || "",
  ],
  credentials: true,
}));

app.use(express.json());

app.use("/api/stock", stockRouter);
app.use("/api/purchases", purchasesRouter);
app.use("/api/sales", salesRouter);
app.use("/api/ledger", ledgerRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/auth", authRouter);
app.use("/api/suppliers", suppliersRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/audit", auditRouter);
app.use("/api/dashboard", dashboardRouter);

app.get("/", (req, res) => {
  res.json({ message: "Stock Manager API is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/ledger", ledgerRouter);
app.use("/api/sales", salesRouter);
app.use("/api/suppliers", suppliersRouter);
app.use("/api/stock", stockRouter);
app.use("/api/purchases", purchasesRouter);
app.use("/api/attendance", attendanceRouter);

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Stock Manager API is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
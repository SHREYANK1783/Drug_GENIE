import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import reminderRoutes from "./routes/reminderRoutes";
import bloodRequestRoutes from "./routes/bloodRequestRoutes";
import notificationRoutes from './routes/notificationRoutes';
import medicineRoutes from './routes/medicineRoutes';
import statsRoutes from './routes/statsRoutes';
import { notFound, errorHandler } from "./middleware/errorMiddleware";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increase limit for profile photo uploads
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Drug GENIE API Server",
    status: "Running",
    endpoints: {
      medicines: {
        search: "/api/medicines/search?query=medicine_name",
        getByName: "/api/medicines/:name",
        getAll: "/api/medicines"
      },
      auth: "/api/auth",
      reminders: "/api/reminders",
      bloodRequests: "/api/blood-requests",
      notifications: "/api/notifications"
    }
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/blood-requests", bloodRequestRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/stats", statsRoutes);

// Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

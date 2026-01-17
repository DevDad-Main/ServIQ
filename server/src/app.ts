import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import authRoutes from "./routes/auth/auth.routes";
import metadataRoutes from "./routes/metadata/metadata.routes";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/api/metadata", metadataRoutes);

export default app;

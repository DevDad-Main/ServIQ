import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import authRoutes from "@/routes/auth/auth.routes";
import metadataRoutes from "@/routes/metadata/metadata.routes";
import knowledgeRoutes from "@/routes/knowledge/knowledge.routes";
import { logger } from "devdad-express-utils";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());

// app.use((req, res, next) => {
//   logger.info(`PATH: ${req.path} URL: ${req.url}`);

//   next();
// });

app.use("/api/auth", authRoutes);
app.use("/api/metadata", metadataRoutes);
app.use("/api/knowledge", knowledgeRoutes);

export default app;

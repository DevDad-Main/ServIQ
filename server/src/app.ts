import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import authRoutes from "@/routes/auth/auth.routes";
import metadataRoutes from "@/routes/metadata/metadata.routes";
import knowledgeRoutes from "@/routes/knowledge/knowledge.routes";
import sectionRouter from "@/routes/section/section.routes";
import { logger } from "devdad-express-utils";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(cookieParser());

// Skip JSON parsing for multipart/form-data requests (file uploads)
app.use((req, res, next) => {
  if (req.headers["content-type"]?.includes("multipart/form-data")) {
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/metadata", metadataRoutes);
app.use("/api/knowledge", knowledgeRoutes);
app.use("/api/section", sectionRouter);

export default app;

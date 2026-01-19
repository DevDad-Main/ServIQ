import app from "@/app";
import { logger } from "devdad-express-utils";

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  logger.info(`Server is running on: http://localhost:${PORT}`);
  logger.info(`PostgreSQL is running on: ${process.env.DATABASE_URL}`);
  
  // Log all registered routes
  const routes = app._router.stack
    .filter(layer => layer.route)
    .map(layer => ({
      path: layer.route.path,
      methods: Object.keys(layer.route.methods).join(',').toUpperCase()
    }));
  
  logger.info("=== REGISTERED ROUTES ===");
  routes.forEach(r => logger.info(`${r.methods} ${r.path}`));
  logger.info("=========================");
});

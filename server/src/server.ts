import app from "@/app";
import { logger } from "devdad-express-utils";

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  logger.info(`Server is running on: http://localhost:${PORT}`);
  logger.info(`PostgreSQL is running on: ${process.env.DATABASE_URL}`);
});

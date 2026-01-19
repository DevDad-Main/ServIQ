import { logger } from "devdad-express-utils";
import multer from "multer";

export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "text/csv") {
      logger.warn(`Invalid file type: ${file.mimetype}`);
      cb(null, false);
    }
    cb(null, true);
  },
});

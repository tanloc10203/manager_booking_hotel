import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dirUpload = "src/assets/upload/";

    if (!fs.existsSync(dirUpload)) {
      fs.mkdirSync(dirUpload, { recursive: true });
    }

    cb(null, dirUpload);
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".");
    const newExt = ext[ext.length - 1];
    cb(null, `${Date.now()}.${newExt}`);
  },
});

const upload = multer({ storage });

export default upload;

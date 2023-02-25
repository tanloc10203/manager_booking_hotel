import cloudinary from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import config from "../config/index.js";

export const cloudinaryV2 = cloudinary.v2;

cloudinaryV2.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryV2,
  params: {
    folder: "booking-hotel",
  },
});

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dirUpload = "src/assets/upload/";

//     if (!fs.existsSync(dirUpload)) {
//       fs.mkdirSync(dirUpload, { recursive: true });
//     }

//     cb(null, dirUpload);
//   },
//   filename: (req, file, cb) => {
//     const ext = file.originalname.split(".");
//     const newExt = ext[ext.length - 1];
//     cb(null, `${Date.now()}.${newExt}`);
//   },
// });

const upload = multer({ storage });

export default upload;

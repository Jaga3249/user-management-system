import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: "dhyhmggr4",
  api_key: "187777896178985",
  api_secret: "pkIJ0yv5r8S8_UsQ8lbJnF7KfXM",
});

export const uploadCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //upload file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); //removed locally saved file as upload operation failed
    return null;
  }
};

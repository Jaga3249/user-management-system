// import { v2 as cloudinary } from "cloudinary";
// import fs from "fs";

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_SECRET_KEY,
// });

// // export const uploadCloudinary = async (localFilePath) => {
// //   console.log("localFilePath", localFilePath);
// //   try {
// //     if (!localFilePath) return null;
// //     //upload file on cloudinary
// //     const response = await cloudinary.uploader.upload(localFilePath, {
// //       resource_type: "auto",
// //     });
// //     // console.log("response :", response);

// //     fs.unlinkSync(localFilePath);
// //     return response;
// //   } catch (error) {
// //     fs.unlinkSync(localFilePath); //removed locally saved file as upload operation failed
// //     return null;
// //   }
// // };

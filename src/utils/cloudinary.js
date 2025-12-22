import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

const uploadOnCloudiary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        // Configure cloudinary if not already configured
        if (!cloudinary.config().cloud_name) {
            cloudinary.config({
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET
            });
        }
        console.log("Uploading file:", localFilePath);
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        //file has been uploaded successfully
        console.log("file is uploaded on cloudinary", response.url);
        return response
    } catch (error) {
        console.log("Cloudinary upload error:", error);
        fs.unlinkSync(localFilePath) //remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

export {uploadOnCloudiary}
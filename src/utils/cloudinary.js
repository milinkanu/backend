import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

const uploadOnCloudinary = async (localFilePath) => {
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

const getPublicIdFromUrl = (url) => {
    // Extract public_id from Cloudinary URL
    // URL format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.{format}
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex !== -1 && uploadIndex + 2 < parts.length) {
        const publicIdWithVersion = parts[uploadIndex + 2];
        // Remove version if present (v followed by numbers)
        const publicId = publicIdWithVersion.replace(/^v\d+\//, '');
        return publicId;
    }
    return null;
}

const deleteFromCloudinary = async (url) => {
    try {
        if (!url) return null
        const publicId = getPublicIdFromUrl(url);
        if (!publicId) return null;
        // Configure cloudinary if not already configured
        if (!cloudinary.config().cloud_name) {
            cloudinary.config({
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET
            });
        }
        console.log("Deleting file from cloudinary:", publicId);
        //delete the file from cloudinary
        const response = await cloudinary.uploader.destroy(publicId)
        console.log("file deleted from cloudinary", response);
        return response
    } catch (error) {
        console.log("Cloudinary delete error:", error);
        return null;
    }
}

export {uploadOnCloudinary, deleteFromCloudinary}
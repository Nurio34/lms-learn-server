const cloudinary = require("cloudinary").v2;

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
});

const uploadVideo = async (filePath) => {
    try {
        return await cloudinary.uploader.upload(filePath, {
            resource_type: "auto",
        });
    } catch (error) {
        throw new Error("Error while uploading media to cloudinary");
    }
};

const deleteVideo = async (publicId) => {
    try {
        return await cloudinary.uploader.destroy(publicId, {
            resource_type: "image",
        });
    } catch (error) {
        throw new Error("Error while deleting the media from cloudinary");
    }
};

module.exports = { uploadVideo, deleteVideo };

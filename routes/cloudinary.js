const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadVideo, deleteVideo } = require("../cloudinary");

const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const response = await uploadVideo(req.file.path);

    return res.status(201).json({
      success: true,
      message: req.file.mimetype.includes("video")
        ? "Video uploaded successfully..."
        : "Image uploaded successfully",
      data: response,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      success: false,
      message: "Error while uploading the video !",
    });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Video id is required !",
      });
    }

    const response = await deleteVideo(id);

    return res.status(200).json({
      success: true,
      message: "Video deleted successfully...",
      data: response,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      success: false,
      message: "Error while deleting the video !",
    });
  }
});

router.post("/bulk-upload", upload.array("file", 10), async (req, res) => {
  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No file recived by server",
    });
  }

  try {
    const uploadPromises = files.map((file) => uploadVideo(file.path));
    const results = await Promise.all(uploadPromises);

    return res.status(201).json({
      success: true,
      message: "Videos uploaded successfully ...",
      videos: results,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "Unexpected error while bulk-uploading ",
    });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const {
    fetchMyCourses,
    fetchMyCourse,
    updateProgress,
    resetProgress,
    updatePlayingLecture,
} = require("../controllers/my-courses");

router.get("/fetch-courses", fetchMyCourses);
router.get("/fetch-course/:courseId", fetchMyCourse);
router.post("/update-progress/:courseId", updateProgress);
router.get("/reset-progress/:courseId", resetProgress);
router.get("/update-playingLecture/:courseId/:index", updatePlayingLecture);

module.exports = router;

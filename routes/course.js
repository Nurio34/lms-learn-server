const express = require("express");
const {
    addCourse,
    getCourses,
    getCourse,
    updateCourse,
    getAllCourses,
    checkIfThisCourseAlreadyBought,
} = require("../controllers/course");
const router = express.Router();

router.post("/add", addCourse);
router.get("/get-courses", getCourses);
router.get("/get-course/:id", getCourse);
router.post("/update", updateCourse);
router.get("/get-all-courses", getAllCourses);
router.get(
    "/check-already-bought-course/:courseId",
    checkIfThisCourseAlreadyBought,
);

module.exports = router;

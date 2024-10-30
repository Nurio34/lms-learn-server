const Course = require("../models/course");
const StudentCourses = require("../models/studentCourses");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_Secret;

const addCourse = async (req, res) => {
    const form = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(404).json({
            status: false,
            message: "Unauthorized demand on course creation !",
        });
    }

    const token = authHeader.split(" ")[1];
    const { id, username } = jwt.verify(token, JWT_SECRET);

    const addToForm = {
        instructerId: id,
        instructerName: username,
        isPublished: true,
    };

    const courseForm = { ...form, ...addToForm };

    try {
        const NewCourse = new Course(courseForm);

        await NewCourse.save();

        return res.status(201).json({
            success: true,
            message: "Course's been added successfully...",
        });
    } catch (error) {
        return res.status(404).json({
            status: false,
            message: "Unexpected error while adding course !",
        });
    }
};

const getCourses = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                status: false,
                message: "Unauthorized action while getCourses",
                authHeader,
            });
        }

        const token = authHeader.split(" ")[1];

        // Verify JWT and handle invalid tokens
        let id;
        try {
            ({ id } = jwt.verify(token, JWT_SECRET));
        } catch (err) {
            return res.status(403).json({
                status: false,
                message: "Invalid or expired token",
                token,
                id,
            });
        }

        // Fetch courses for the instructor
        const courses = await Course.find({ instructerId: id });

        return res.status(200).json({
            status: true,
            message: "Here are your courses ...",
            courses,
        });
    } catch (error) {
        console.error("Error in getCourses:", error); // Helps in debugging server-side issues
        return res.status(500).json({
            status: false,
            message: "Unexpected error while getCourses",
            error,
        });
    }
};

const getCourse = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(404).json({
            success: false,
            message: "Problem with getting courseId !",
        });
    }

    try {
        const course = await Course.findOne({ _id: id });

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Problem while getCourse !",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Course got successfully...",
            course,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unexpected error while getCourse !",
        });
    }
};

const updateCourse = async (req, res) => {
    const course = req.body;

    if (!course) {
        return res.status(404).json({
            success: false,
            message: "Failed to update course !",
        });
    }

    const courseId = course._id;
    try {
        const UpdatedCourse = await Course.findByIdAndUpdate(courseId, course, {
            new: true,
            runValidators: true,
        });

        if (!UpdatedCourse) {
            return res.status(404).json({
                success: false,
                message: "Failed to getting updated course !",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Curse's been updated successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unexpected error while updating course !",
        });
    }
};

const getAllCourses = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(404).json({
                status: false,
                message: "Unauthorized action while getAllCourses",
            });
        }

        const courses = await Course.find();

        if (courses.length === 0) {
            return res.status(404).json({
                status: false,
                message: "You don't have any courses yet !",
            });
        }

        return res.status(200).json({
            status: true,
            message: "Here are your courses ...",
            courses,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Unexpected error while getCourses",
        });
    }
};

const checkIfThisCourseAlreadyBought = async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized action !",
        });
    }

    const token = authHeader.split(" ")[1];
    const { id } = jwt.verify(token, JWT_SECRET);
    const { courseId } = req.params;

    try {
        const MyCourses = await StudentCourses.findOne({ studentId: id });

        if (!MyCourses) {
            return res.status(200).json({
                success: false,
                message: "You don't have any course bought yet !",
                data: false,
            });
        }

        const isCourseAlreadyBought = MyCourses.courses.some(
            (course) => course.courseId === courseId,
        );

        return res.status(200).json({
            success: true,
            data: isCourseAlreadyBought,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unexpected Network Error !",
        });
    }
};

module.exports = {
    addCourse,
    getCourses,
    getCourse,
    updateCourse,
    getAllCourses,
    checkIfThisCourseAlreadyBought,
};

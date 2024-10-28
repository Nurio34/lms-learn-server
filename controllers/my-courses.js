const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const StudentCourses = require("../models/studentCourses");
const Courses = require("../models/course");
const CourseProgress = require("../models/courseProgress");

const fetchMyCourses = async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized action",
        });
    }

    const token = authHeader.split(" ")[1];
    const { id } = jwt.verify(token, process.env.JWT_SECRET);

    try {
        const MyCourses = await StudentCourses.findOne({ studentId: id });

        if (!MyCourses) {
            return res.status(404).json({
                success: false,
                message: "You don't have any courses bought yet !",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Here are your courses",
            data: MyCourses.courses,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unexpected Network error !",
        });
    }
};

const fetchMyCourse = async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized action !",
        });
    }

    const token = authHeader.split(" ")[1];
    const { id } = jwt.verify(token, JWT_SECRET);
    const studentId = id;
    const { courseId } = req.params;

    try {
        const course = await Courses.findById(courseId);
        const isThisCourseBought = course.students.some(
            (student) => student.id === studentId,
        );

        if (!isThisCourseBought) {
            return res.status(200).json({
                success: true,
                message: "You did not buy this course !",
                isThisCourseBought,
            });
        }

        const CurrentCourseProgress = await CourseProgress.findOne({
            studentId,
            courseId,
        });

        if (!CurrentCourseProgress) {
            const NewCurrentCourseProgress = new CourseProgress({
                studentId,
                courseId,
                complated: false,
                complationDate: "",
                lectureProgress: course.lectures.map((lecture, index) => {
                    return {
                        lectureId: lecture._id,
                        viewed: false,
                        viewedDate: "",
                    };
                }),
                playingLecture: 0,
            });
            await NewCurrentCourseProgress.save();
            return res.status(200).json({
                success: true,
                message: "Here are your course and progress informations ...",
                isThisCourseBought,
                course,
                progress: NewCurrentCourseProgress,
            });
        }
        return res.status(200).json({
            success: true,
            message: "Here are your course and progress informations ...",
            isThisCourseBought,
            course,
            progress: CurrentCourseProgress,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Here are your course and progress informations ...",
        });
    }
};

const updateProgress = async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized action !",
        });
    }

    const token = authHeader.split(" ")[1];
    const { id } = jwt.verify(token, JWT_SECRET);
    const studentId = id;
    const { courseId } = req.params;
    const { lectureId, nextLectureIndex } = req.body;

    try {
        const CurrentProgress = await CourseProgress.findOneAndUpdate(
            { studentId, courseId, "lectureProgress.lectureId": lectureId },
            {
                $set: {
                    "lectureProgress.$.viewed": true,
                    "lectureProgress.$.viewedDate": new Date(),
                },
                playingLecture: nextLectureIndex,
            },
            { new: true },
        );

        if (!CurrentProgress) {
            return res
                .status(404)
                .json({ success: false, message: "An error occured !" });
        }

        return res.status(201).json({
            success: true,
            message: "New lecture is ready ...",
            progress: CurrentProgress,
        });
    } catch (error) {
        return res
            .status(404)
            .json({ success: false, message: "Unexpected Network Error !" });
    }
};

const resetProgress = async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized action !",
        });
    }

    const token = authHeader.split(" ")[1];
    const { id } = jwt.verify(token, JWT_SECRET);
    const studentId = id;
    const { courseId } = req.params;

    try {
        const UpdatedProgress = await CourseProgress.findOneAndUpdate(
            { studentId, courseId },
            {
                $set: {
                    "lectureProgress.$[lastLecture].viewed": true,
                    isCourseComplatedOnce: true,
                },
                playingLecture: 0,
            },
            {
                new: true,
                arrayFilters: [{ lastLecture: { $exists: true } }],
            },
        );

        if (!UpdatedProgress) {
            return res
                .status(404)
                .json({ success: false, message: "An error occured !" });
        }

        return res.status(201).json({
            success: true,
            message: "You are free to watch any lecture ...",
            progress: UpdatedProgress,
        });
    } catch (error) {
        return res
            .status(404)
            .json({ success: false, message: "Unexpected Network Error !" });
    }
};

const updatePlayingLecture = async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized action !",
        });
    }

    const token = authHeader.split(" ")[1];
    const { id } = jwt.verify(token, JWT_SECRET);
    const studentId = id;
    const { courseId, index } = req.params;

    console.log({ studentId, courseId, index });

    try {
        const UpdatedProgress = await CourseProgress.findOneAndUpdate(
            { studentId, courseId },
            {
                playingLecture: index,
            },
            {
                new: true,
            },
        );

        if (!UpdatedProgress) {
            return res
                .status(404)
                .json({ success: false, message: "An error occured !" });
        }

        return res.status(201).json({
            success: true,
            message: "New lecture is ready ...",
            progress: UpdatedProgress,
        });
    } catch (error) {
        return res
            .status(404)
            .json({ success: false, message: "Unexpected Network Error !" });
    }
};

module.exports = {
    fetchMyCourses,
    fetchMyCourse,
    updateProgress,
    resetProgress,
    updatePlayingLecture,
};

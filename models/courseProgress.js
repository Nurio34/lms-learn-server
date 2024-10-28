const mongoose = require("mongoose");

const LectureProgressSchema = new mongoose.Schema({
    lectureId: String,
    viewed: Boolean,
    viewedDate: Date,
});

const CourseProgressSchema = new mongoose.Schema({
    studentId: String,
    courseId: String,
    complationDate: Date,
    lectureProgress: [LectureProgressSchema],
    isCourseComplatedOnce: Boolean,
    playingLecture: Number,
});

module.exports = mongoose.model("Progress", CourseProgressSchema);

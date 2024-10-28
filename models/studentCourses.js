const mongoose = require("mongoose");

const StudentCoursesSchema = new mongoose.Schema({
    studentId: String,
    courses: [
        {
            courseId: String,
            title: String,
            intructerId: String,
            instructerName: String,
            purchaseDate: {
                type: Date,
                default: Date.now(),
            },
            courseImage: String,
        },
    ],
});

module.exports = mongoose.model("StudenCourses", StudentCoursesSchema);

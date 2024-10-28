const mongoose = require("mongoose");

const LectureSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    videoUrl: {
        type: String,
        required: true,
    },
    freePreview: {
        type: Boolean,
        required: true,
    },
    public_id: {
        type: String,
        required: true,
    },
    isFileLoading: Boolean,
});

const ImageSchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: true,
    },
    public_id: {
        type: String,
        required: true,
    },
});

const StudentSchema = new mongoose.Schema({
    id: String,
    name: String,
    email: String,
});

const CourseSchema = new mongoose.Schema(
    {
        instructerId: {
            type: String,
            required: true,
        },
        instructerName: {
            type: String,
            required: true,
        },
        lectures: [LectureSchema],
        title: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        level: {
            type: String,
            required: true,
        },
        primaryLanguage: {
            type: String,
            required: true,
        },
        subtitle: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        pricing: {
            type: String,
            required: true,
        },
        objectives: {
            type: String,
            required: true,
        },
        welcomeMessage: {
            type: String,
            required: true,
        },
        image: ImageSchema,
        students: {
            type: [StudentSchema],
            default: [],
        },

        isPublished: {
            type: Boolean,
            default: true,
        },
        comments: [String],
    },
    { timestamps: true },
);

module.exports = mongoose.model("Course", CourseSchema);

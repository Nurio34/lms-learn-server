const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema({
    studentId: String,
});
const DislikeSchema = new mongoose.Schema({
    studentId: String,
});

const CommentSchema = new mongoose.Schema(
    {
        courseId: String,
        lectureId: String,
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        commentType: String,
        comment: String,
        repliedCommentId: String,
        repliedStudentId: String,
        repliedStudentName: String,
        mainCommentId: String,
        likes: [LikeSchema],
        dislikes: [DislikeSchema],
    },
    { timestamps: true },
);

module.exports = mongoose.model("Comments", CommentSchema);

const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
    url: String,
    public_id: String,
});

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    lastLoginDate: { type: String },
    image: ImageSchema,
});

module.exports = mongoose.model("User", UserSchema);

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true,
        },
        passwordHash: {
            type: String,
            required: true,

        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
        },
        avatarUrl: String,
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('User', UserSchema)

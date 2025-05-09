const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    salary: {
        type: Number,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    applicants: [
        {
            applicantId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "users",
                required: true,
            },
            coverLetter: {
                type: String,
                required: true,
            },
            appliedAt: {
                type: Date,
                default: Date.now,
            },
            status: {
                type: String,
                default: "Pending",
                enum: ["Pending", "Reviewed", "Accepted", "Rejected"],
            },
        },
    ],
}, { timestamps: true });

const Jobs = mongoose.model("Jobs", jobSchema);

module.exports = Jobs;

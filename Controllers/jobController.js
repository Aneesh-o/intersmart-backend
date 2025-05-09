const Job = require("../Models/jobModel");
const users = require('../Models/userModel')


// Add job
exports.addJobDetails = async (req, res) => {
    console.log("Inside addJobDetails");
    const { title, description, company, location, salary } = req.body;
    const userId = req.userId; // This should be set by your JWT auth middleware
    try {
        const newJob = new Job({
            title,
            description,
            company,
            location,
            salary,
            createdBy: userId
        });

        await newJob.save();

        res.status(201).json({ message: "Job created successfully", job: newJob });
    } catch (error) {
        console.error("Error creating job:", error);
        res.status(500).json({ error: "Failed to create job" });
    }
};

// getAllJob
exports.getAllJobDetails = async (req, res) => {
    console.log("Inside getAllJobDetails");
    try {
        const jobs = await Job.find()
            .populate("createdBy", "name email")
            .populate("applicants.applicantId", "name email");

        res.status(200).json(jobs);
    } catch (error) {
        console.error("Error fetching all jobs:", error);
        res.status(500).json({ error: "Failed to fetch all jobs" });
    }
};

// getUserJob
exports.getUserJobDetails = async (req, res) => {
    console.log("Inside getUserJobDetails");
    const userId = req.userId;
    try {
        const userJobs = await Job.find({ createdBy: userId });
        res.status(200).json(userJobs);
    } catch (error) {
        console.error("Error fetching user's jobs:", error);
        res.status(500).json({ error: "Failed to fetch user's jobs" });
    }
};

// deleteUserJob
exports.deleteUserPostedJobs = async (req, res) => {
    console.log("Inside deleteUserPostedJobs");
    const userId = req.userId;
    const jobId = req.params.id;
    try {
        const deletedJob = await Job.findOneAndDelete({ _id: jobId, createdBy: userId });
        if (!deletedJob) {
            return res.status(404).json({ message: "Job not found or you are not authorized to delete it" });
        }
        res.status(200).json({ message: "Job deleted successfully", deletedJob });
    } catch (error) {
        console.error("Error deleting job:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

// editUserJob
exports.editUserPostedJobs = async (req, res) => {
    console.log("Inside editUserPostedJobs");
    const userId = req.userId;
    const jobId = req.params.id;
    const { title, description, company, location, salary } = req.body;
    try {
        const updatedJob = await Job.findOneAndUpdate(
            { _id: jobId, createdBy: userId }, // Match job by ID and user
            { title, description, company, location, salary },
            { new: true }
        );
        if (!updatedJob) {
            return res.status(404).json({ message: "Job not found or unauthorized to update" });
        }

        return res.status(200).json({ message: "Job updated successfully", updatedJob });
    } catch (error) {
        console.error("Error updating job:", error);
        return res.status(500).json({ message: "Internal Server Error", error });
    }
};


exports.applyForJob = async (req, res) => {
    console.log("Inside applyForJob");

    const { jobId } = req.params;
    const userId = req.userId;
    const { coverLetter } = req.body;

    try {
        // Validate user
        const userDetails = await users.findById(userId);
        if (!userDetails) {
            return res.status(404).json({ error: "User not found" });
        }

        // Validate job
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ error: "Job not found" });
        }

        const jobTitle = job.title;

        // Check if already applied
        const alreadyApplied = job.applicants.some(
            (applicant) => applicant.applicantId.toString() === userId
        );
        if (alreadyApplied) {
            return res.status(400).json({ error: "You have already applied for this job." });
        }

        // Validate cover letter
        if (!coverLetter || coverLetter.trim() === "") {
            return res.status(400).json({ error: "Cover letter is required." });
        }

        // Push new application
        job.applicants.push({
            applicantId: userId,
            coverLetter,
            appliedAt: new Date(),
            status: "Pending",
        });

        await job.save();

        res.status(200).json({ message: "Applied successfully", job });
    } catch (error) {
        console.error("Error applying for job:", error);
        res.status(500).json({ error: "Failed to apply for job" });
    }
};


exports.getMyPostedJobsWithApplicants = async (req, res) => {
    try {
        const userId = req.userId;

        const jobs = await Job.find({ createdBy: userId })
            .populate("applicants.applicantId", "username email phoneNumber qualification")
            .select("title company location jobType skills applicants");

        const jobData = jobs.map((job) => ({
            _id: job._id,
            title: job.title,
            company: job.company,
            location: job.location,
            jobType: job.jobType,
            skills: job.skills,
            totalApplicants: job.applicants.length,
            applicants: job.applicants.map((app) => ({
                userId: app.applicantId?._id,
                username: app.applicantId?.username,
                email: app.applicantId?.email,
                phoneNumber: app.applicantId?.phoneNumber,
                qualification: app.applicantId?.qualification,
                appliedAt: app.appliedAt,
                status: app.status,
                coverLetter: app.coverLetter  
            }))
        }));

        res.status(200).json(jobData);
    } catch (error) {
        console.error("Error fetching jobs with applicants:", error);
        res.status(500).json({ error: "Server error fetching posted jobs with applicants" });
    }
};




const express = require('express')
const userConroller = require('../Controllers/userController')
const jwtMiddleWare = require('../MiddleWare/jwtMiddleWare')
const JobController = require('../Controllers/jobController')

const router = new express.Router()

router.post('/register', userConroller.registerController)

router.post('/login', userConroller.loginController)

router.post('/add-job', jwtMiddleWare,JobController.addJobDetails)

router.get("/get-jobs", jwtMiddleWare, JobController.getAllJobDetails);

router.get("/get-userJobs", jwtMiddleWare, JobController.getUserJobDetails);

router.delete("/deleteUserJobs/:id", jwtMiddleWare, JobController.deleteUserPostedJobs);

router.put("/editUserJobs/:id", jwtMiddleWare, JobController.editUserPostedJobs);

router.post("/apply/:jobId", jwtMiddleWare, JobController.applyForJob);

// Route to get jobs posted by the current user with applicants
router.get("/jobs/my-posted-jobs", jwtMiddleWare, JobController.getMyPostedJobsWithApplicants);


module.exports = router;
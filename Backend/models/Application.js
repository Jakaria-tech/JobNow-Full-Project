const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    jobTitle: { type: String, required: true },
    recruiterEmail: { type: String, required: true },
    applicantEmail: { type: String, required: true },
    applicantName: { type: String, required: true },
    applicantCv: {
        phone: String,
        skills: String,
        education: String,
        experience: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Application', ApplicationSchema);
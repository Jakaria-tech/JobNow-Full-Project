const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    desc: { type: String, required: true },
    type: { type: String, required: true },
    salary: { type: String, required: true },
    recruiterEmail: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);
const express = require('express');
const connectDB = require('./config/db');


const jobRoutes = require('./routes/jobRoutes'); 

const app = express();

connectDB();


app.use(express.json());


app.use('/api/jobs', jobRoutes); 

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`); // ইংরেজি মেসেজ
});
module.exports = app;
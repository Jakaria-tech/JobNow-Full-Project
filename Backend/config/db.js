/* cspell:disable */
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const connString = "mongodb+srv://mdjakaria3001_db_user:Jaka1234@cluster0.f51rutm.mongodb.net/jobnow_db?retryWrites=true&w=majority";
    } catch (err) {
        console.error(`❌ Database Connection Error: ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
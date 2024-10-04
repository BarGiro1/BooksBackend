const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/library';
const connectDB =  () => {
    try {
        mongoose.connect(MONGO_URI, {
            useNewUrlParser: true, 
            useUnifiedTopology: true
        });
        mongoose.connection.once('open', () => {
            console.log('Connected to MongoDB successfully');
        });
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}

module.exports = connectDB;
const mongoose = require('mongoose');
// require('dotenv').config();

const dbConnection = async() => {
    try{

        await mongoose.connect(process.env.DB_CNN);
        console.log('DB online');
    } catch ( error ) {
    console.log(error);
    throw new Error('error a la hora de iniciar la BD ver logs');
    }
}

module.exports = {
    dbConnection
}
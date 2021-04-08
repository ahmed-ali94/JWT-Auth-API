const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const verifyToken = require('./routes/verifyToken');

// import routes

const authRoute = require('./routes/auth');


dotenv.config();

//connect to db

mongoose.connect(process.env.DB_CONNECT,{ useNewUrlParser: true }, function(err){
    if (err) throw err;
} );



// Middleware

app.use(express.json());

app.use(cors());




// Route middelwares

app.use('/api/user',authRoute);
app.use('/api/user/', verifyToken);

app.listen(3000, () => console.log('Server up anmd running'));




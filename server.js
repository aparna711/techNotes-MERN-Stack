require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const {logger, logEvents} = require('./middlewares/logger.js');
const errorHandler = require('./middlewares/errorHandler.js')
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions =require("./config/corsOptions");
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn.js');
const PORT = process.env.PORT || 3000;;

connectDB();
console.log(process.env.NODE_ENV);
//Third-party middleware --> Is like a factory function (When called which returns a function)
//So, mostly we use {} curly braces
app.use(cookieParser());

app.use(cors(corsOptions));

//Custom middleware (Mostly called without {} braces)
app.use(logger);


//built-in middleware, parsing JSON data from req.body
app.use(express.json())
//buit-in Middleware Serving static files
app.use('/',express.static(path.join(__dirname,'public')) );



//Home Route Handler
app.use('/', require('./routes/root'));
//Users Handler
app.use('/users',require('./routes/userRoutes'));
app.use('/notes', require('./routes/noteRoutes'))
//404 Handler
app.use((req, res)=>{
    res.status(404);
    if(req.accepts('html')){  
       res.sendFile(path.join(__dirname,'views','404.html'));
    }
    else if(req.accepts('json')){
         res.json({message:"Error : 404 Page not Found"});
    }
    else{
        res.type('txt').send('Error : 404 Page not Found');
    }
});
//Custom middleware
app.use(errorHandler);

mongoose.connection.once('open', ()=>{
    console.log("Connected to Mongoose");
    app.listen(PORT, ()=>{
        console.log(`Server is listening in PORT: ${PORT}`);
    });
})

mongoose.connection.on('error', err =>{
    console.log(err);
    logEvents(`${err.no}:${err.code}\t${err.syscall}\t${err.hostname}\n`,'mongoErrLog.log');
})
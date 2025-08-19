const allowedOrigins = require('./allowedOrigins');
const corsOptions = {
    origin:(origin,callback)=>{
        if(allowedOrigins.indexOf(origin)!== -1 || !origin){ 
            callback(null, true);   //Arg : No Error don't pass Error obj , request allowed true
        }
        else{
            callback(new Error('Not allowed by CORS')) //Arg: Pass Error obj
        }
    },
    credentials : true,
    optionsSuccessStatus: 200 //Some browsers give error in Status Code 204 : Sucess No Content to Return

} 
module.exports = corsOptions;
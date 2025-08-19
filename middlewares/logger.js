const {format} = require('date-fns');
const {v4:uuid} = require('uuid');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
//Asyn function - doing the task of logging data into a logfile
const logEvents = async (message, logFileName)=>{
    const dateTime = format(new Date(),'yyyy-MM-dd\tHH:mm:ss');
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
    try{
        if(!fs.existsSync(path.join(__dirname,'..','logs'))){
            await fsPromises.mkdir(path.join(__dirname,'..','logs'));
        }
        await fsPromises.appendFile(path.join(__dirname,'..','logs',`${logFileName}`),logItem)
    }
    catch(err){
        console.log(err);
    }
}
//Custom middleware - Actually implementing the above function
const logger = (req,res,next) =>{
    logEvents(`${req.method} \t ${req.url} \t ${req.headers.origin||'No Origin'}`,'reqLog.log');
    console.log(`${req.method}\t${req.url}`);
    next();
}
module.exports = {logEvents, logger}

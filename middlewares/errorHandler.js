const {logEvents} = require('./logger.js');
const errorHandler = (err, req, res, next) =>{
        logEvents(`${err.name}\t${err.message}\t${req.method}\t${req.url}\t${req.headers.origin || 'No Origin'}`,'errLog.log')
        console.log(err.stack);
        const status = res.statusCode ? res.statusCode : 500;
        res.status(status).json({messsage : err.message});
        next();
}
module.exports = errorHandler;
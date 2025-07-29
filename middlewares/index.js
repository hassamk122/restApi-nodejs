
const fs = require("fs")

function logRequestResponse(filename){
    return (request,response,next)=>{
        fs.appendFile(
            filename,
            `\n${Date.now()}:${request.ip} ${request.method} ${request.path}\n`,
            (error,data)=>{
                next();
            }
        )
    }
}
module.exports = {
    logRequestResponse,
}
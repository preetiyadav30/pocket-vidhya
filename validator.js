const { request, response } = require("express");
const jwt = require("jsonwebtoken");

require('dotenv').config();

const verifyToken = (request,response,next)=>{
try{
    const authorizationHeader = request.headers.authorization;

    if(authorizationHeader){
        const token = authorizationHeader.split(" ")[1]
        jwt.verify(token,process.env.POKET_VIDHYASACRET,(error,payload)=>{
            if (error) {
                response.send("please provide valid token");
                console.log(payload);
            }
            else{
            next();
            }
        })
    }
    else{
        response.status(401).send({
            success:false,
            msg:"please add token with Header"});
        } 
}

catch(err){
  response.status(400).send({
    success:false,
    err:err
  })
}
}
module.exports = verifyToken;
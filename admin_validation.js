const { request, response } = require('express');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const verifyAdmin = (request, response, next) => {
    const authorizationHeader = request.headers.authorization;

    if (authorizationHeader) {
        const token = authorizationHeader.split(" ")[1]
        jwt.verify(token, process.env.POCKET_ADMIN_SECRET, (err, payload) => {
            if (err) {
                response.status(401).send({
                    success: false,
                    err: err
                })
            }
            else {
                next();
            }
        })
    }
    else {
        response.status(401).send({
            success: false,
            msg: "Please enter Valid Token"
        })
    }
}
module.exports = verifyAdmin
// const crypto=require('crypto')

// crypto.randomBytes(256,(err,buf)=>{
//     if(err) throw err
//     if(buf){
//     console.log(`${buf.length}${buf.length} bytes of random data: ${buf.toString('ucs2')}`);
//     }
// })
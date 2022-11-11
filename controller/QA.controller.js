const db = require("../dbConnections")
const express = require('express')
const jwt = require('jsonwebtoken');
const { body, Result } = require("express-validator");
require('dotenv').config();
const bcrypt = require('bcrypt');
const cors = require('cors')
const { request } = require('express');

const QA=async(req,res,next)=>{
    try{
        
        const auth = req.headers.authorization.split(" ")[1]
        const decode = jwt.decode(auth)
        const decoded_userId=decode.data[0].user_id

        db.query("select question_id,level,category,question,option1, option2,  option3,  option4,correct_option from questionnaire rand where question_id=?",[req.body.question_id],(err,result)=>{
            if(!req.body.question_id||!req.body.answer){
              res.status(404).send({
                success:false,
                msg:`Please enter question_id and answer`
                
              })
        }           
          else if(err){
                res.status(400).send({
                    success:true,
                    err:err
                })
            }
           else if(result){
                let isCorrect_answer;
                if(!result.length){
                    res.status(400).send({
                        success:"false",
                        msg:`Question witht id:${req.body.question_id} is not available`
                    })
                }
                else{
                if(result[0].correct_option!==req.body.answer){
                    isCorrect_answer=0;
                }
                else if(result[0].correct_option==req.body.answer){
                     isCorrect_answer=1;
                }
                res.status(200).send({
                    success:true,
                    Correct_Answer:isCorrect_answer,
                    QuestionResponse:result,
                   
                })

            
                
            }
        }
    })       
}
catch(err){
    res.status(400).send({
        success:false,
        err:err.message
    })
}
}

module.exports={QA}
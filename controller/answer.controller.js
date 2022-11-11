const db = require("../dbConnections")
const express = require('express')
const jwt = require('jsonwebtoken');
const { body, Result } = require("express-validator");
require('dotenv').config();
const bcrypt = require('bcrypt');
const cors = require('cors')
const { request } = require('express');

const answer_attempt = async (req, res, next) => {

    try {

        const auth = req.headers.authorization.split(" ")[1]
        const decode = jwt.decode(auth)

        const decoded_Username = decode.data[0].user_id

        db.query(`Select * from questionnaire where question_id=? and Status="ACTIVE" `, [req.body.question_id], (question_err, question_result) => {
            if (question_err) {
                res.status(400).send({
                    success: false,
                    err: question_err
                })
            }

            if (question_result) {

                if (!question_result.length) {
                    res.status(404).send({
                        success: false,
                        msg: `question for id:${req.body.question_id} not found or question is INACTIVE`
                    })
                }
                else {
                    // console.log(question_result[0].correct_Option)
                    if (req.body.answer != question_result[0].correct_Option) {
                        var isCorrectans = '0'
                    }
                    if (req.body.answer == question_result[0].correct_Option) {
                        var isCorrectans = '1'
                    }

                    db.query('Insert into  answer (user_id,question_id,category,answer,isCorrect) values(?,?,?,?,?)', [decoded_Username, req.body.question_id, question_result[0].category, req.body.answer, isCorrectans], (answerInsert_err, answerInsert_result, feilds) => {
                        if (answerInsert_err) {
                            res.status(400).send({
                                success: false,
                                err: answerInsert_err
                            })
                        }
                        else if (answerInsert_result) {
                            db.query(`select *, count(distinct(question_id)) as total_Question_Answered from  answer where user_id=? and category=?`, [decoded_Username, question_result[0].category], (totalAnswer_err, totalAnswer_result, feilds) => {
                                if (totalAnswer_err) {
                                    res.status(400).send({
                                        success: false,
                                        totalAnswererr: totalAnswer_err
                                    })
                                }
                                if (totalAnswer_result) {
                                    // console.log(question_result[0].category)

                                    //This seelects the total no of Active questions from questionnaire table 
                                    // console.log(totalAnswer_result)
                                    db.query(`select question_id,count(question_id) as Total_Available_Questions from questionnaire where status='ACTIVE' and category='${question_result[0].category}'`, (totalQuestion_err, totalQuestion_result) => {
                                        if (totalQuestion_err) {
                                            res.status(400).send({
                                                success: false,
                                                err: totalAnswer_err
                                            })
                                        }
                                        if (totalQuestion_result) {

                                            // console.log(totalQuestion_err)

                                            db.query(`select count(distinct(question_id)) as Total_Correct_Answers from  answer where user_id =? and isCorrect='1' and category=?`, [decoded_Username, question_result[0].category], (correctAnswer_err, correctAnswer_result) => {

                                                if (correctAnswer_err) {
                                                    res.status(400).send({
                                                        success: false,
                                                        err: correctAnswer_result
                                                    })
                                                }
                                                if (correctAnswer_result) {
                                                    // const Total_Questions = totalQuestion_result[0].To
                                                    const Total_Available_Questions = totalQuestion_result[0].Total_Available_Questions

                                                    const Total_Correct_Answers = correctAnswer_result[0].Total_Correct_Answers

                                                    const Total_Questions_Attempted = totalAnswer_result[0].total_Question_Answered

                                                    const Questions_RemainnigTo_Attempt = Total_Available_Questions - Total_Questions_Attempted

                                                    const Total_Incorrect_Answers = Total_Questions_Attempted - Total_Correct_Answers
                                                    if (Total_Questions_Attempted >= Total_Available_Questions) {

                                                        db.query("Insert into attempts(user_id,category,q_attempted,correct_Answers,Score) values(?,?,?,?,?) ", [decoded_Username, question_result[0].category, Total_Questions_Attempted, Total_Correct_Answers, Total_Correct_Answers], (insertAttempt_err, insertAttempt_result) => {
                                                            if (insertAttempt_err) {
                                                                res.status(400).send({
                                                                    success: false,
                                                                    err: insertAttempt_err
                                                                })
                                                            }
                                                            if (insertAttempt_result) {

                                                                db.query('delete from  answer where user_id=? and category=?', [decoded_Username, question_result[0].category], (vacantAnswer_err, vacantAnswer_result) => {
                                                                    if (vacantAnswer_err) {
                                                                        res.status(400).send({
                                                                            success: false,
                                                                            err: vacantAnswer_err
                                                                        })
                                                                    }
                                                                    if (vacantAnswer_result) {
                                                                        res.status(200).send({
                                                                            success: true,
                                                                            isCorrect: isCorrectans,
                                                                            msg: "Attempt Completed and counted",
                                                                            Total_No_of_Questions: Total_Available_Questions,
                                                                            Total_Question_Attempted: Total_Questions_Attempted,
                                                                            Correct_Answers: Total_Correct_Answers,
                                                                            Incorrect_Answers: Total_Incorrect_Answers,
                                                                            Score: `${Total_Correct_Answers}/${Total_Available_Questions}`

                                                                        })
                                                                    }

                                                                })

                                                            }

                                                        })
                                                    }
                                                    else {

                                                        res.status(200).send({
                                                            success: true,
                                                            isCorrect: isCorrectans,
                                                            msg: `Remaining ${Questions_RemainnigTo_Attempt} questions Should be Initiated for counting an Attempt`,
                                                            Total_No_of_Questions: Total_Available_Questions,
                                                            Total_Question_Attempted: Total_Questions_Attempted,
                                                            Correct_Answers: Total_Correct_Answers,
                                                            Incorrect_Answers: Total_Incorrect_Answers,

                                                        })
                                                    }
                                                }
                                            })
                                        }
                                    })

                                }

                            })

                        }
                    })
                }

            }

        })
    }
    catch (err) {
        res.status(400).send({
            success: false,
            err: err.message
        })
    }
}

module.exports = { answer_attempt }
const express=require('express');
const router=express.Router();
const jwt=require('jsonwebtoken')
const db=require('./dbConnections')
const controller=require('./controller/user.controller')
const QAcontroller=require('./controller/QA.controller')
const multer=require('multer')
const path=require('path')
const validation=require('./validator')

const controller1=require('./controller/answer.controller')
const adminValidation=require('./admin_validation');const { JWT } = require('google-auth-library');
const cors=require('cors')
const storage= multer.diskStorage({
    destination:'Pocket_Vidhya/public/images',
    filename:(req,file,callback)=>{
        return callback(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})
const upload=multer({
    storage:storage
});



router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();});

/**************USER ******************/
router.post('/signup11',controller.signup)

router.get('/getAvtar',upload.single('image'),controller.avtar_category)

router.post('/add_avtar', adminValidation,upload.single('image'),controller.add_avtar)

router.post('/answer',validation,controller.answer1);

router.post ('/get_question_user',validation,controller.get_question_user)

router.post('/quiz_Categories',validation,controller.quiz_category)
//****************************************************************************/

/*************ADMIN **********************************************************/

router.get('/user/total',adminValidation,controller.total_user)

router.get('/admin/Dashboard_total',adminValidation,controller.total_language)

router.get('/admin/total_category',adminValidation,controller.total_category)

router.patch('/admin/update_question_status',adminValidation,controller.admin_update_questionStatus)

router.patch('/admin_update_question',adminValidation,controller.admin_update_question);

router.post('/admin/add_category',adminValidation,controller.admin_add_category)

router.post('/admin/delete_language',adminValidation,controller.admin_delete_language)

router.post('/admin/add_question',adminValidation,controller.add_question)

router.delete('/admin/delete/question',controller.admin_delete_question);

router.post('/admin/Signup',controller.admin_signup)

router.post('/admin/Login',controller.adminLogin1)

router.post('/admin/add_language',adminValidation,controller.admin_add_language)

router.get('/admin/getStatistics',adminValidation,controller.admin_Statistics)

router.get('/admin/getQuestions:',controller.admin_getQuestion)

router.get('/admin/getUsers',adminValidation,controller.admin_get_user)

router.post('/user/answer',validation,controller1.answer_attempt)

router.post('user/logout',validation,controller.logout)

router.post('/user/QA',QAcontroller.QA)

//***************************************************************************/
module.exports=router
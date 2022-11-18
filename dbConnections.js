
const mysql=require('mysql');
const db=mysql.createConnection({
    user:"root",
    password:"",
    host:"localhost",
    database:"pocket_vidhya"
})
db.connect((err)=>{

    if(err){
        console.log("Can't Connected databse")
    }
    else{
        console.log("Database Connected")
    }
    
})
module.exports=db

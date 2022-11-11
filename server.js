const bodyParser = require('body-parser');
const express=require('express');

const cors=require('cors')
// const path = require('path');
const app=express();


let corOption ={
    origin:'*',
    methods:["GET","POST","PUT","DELETE"],
  }

  app.use(cors(corOption));

const db=require('./dbConnections')
const indexrouter=require('./router')




app.use(express.json());
app.use(bodyParser.urlencoded({
    extended:true
}))

// let corOption ={
//     origin:['http://localhost:3000','http://localhost:5000'],
//     methods:["GET","POST","PUT","DELETE"],
//   }
//   app.use(cors(corOption));

//   app.options('*', cors());

  app.use(bodyParser.json());

  app.use('/',express.static("Pocket_Vidhya/public/images"))

  app.use(indexrouter)

// app.get('/gettok',(req,res)=>{
//     const auth=req.headers.authorization.split(" ")[1]
//     console.log(auth);
// })

app.get("admin/getUsers/?",(req,res)=>{
  const category=req.params.category;
res.status(200).send({
  success:true,
  category1:category
})
console.log(req.query.category)
})

app.listen(3000,()=>{
    
    console.log("Server up and Running on port 3000");
})
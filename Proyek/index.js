const express=require("express");
const app = express();
// const fs= require("fs");
// const morgan=require('morgan');
// const accessLogStream  = fs.createWriteStream('./218116716.log', {flags:'a'},);
app.set('view engine','ejs');
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

const user = require('./routes/user');
const admin = require('./routes/admin');
app.use('/api/users', user);
app.use('/api/admin', admin);


app.get('/login', (req,res) => {
    return res.render('pages/login',{
        message:"",
        errorMessage:"",
        resultArr:[]
    });
})

app.get('/api/test', function (req, res){
    return res.send('hello world');
});


app.listen(port, function(){
    console.log('Listening to port 3000');
});

// logging
// morgan.token('meth',(req,res)=>{
//     return `Method: `;
// });
// morgan.token('stat',(req,res)=>{
//    return `; Status: ${res.statusCode};`;
// });
// morgan.token('msg',(req,res)=>{
//     let m = '-';
//     if(res.statusCode == 400){
//         m = 'Bad Request';
//     }else if(res.statusCode == 404){
//         m = 'Not Found';
//     }else if(res.statusCode == 401){
//         m = 'Unauthorized';
//     }else if(res.statusCode == 200){
//         m = 'Sukses';
//     }else if(res.statusCode == 201){
//         m = 'Created';
//     }
//     return `Message: ${m};`;
// });
// morgan.token('tgl',(req,res)=>{
//     let d = new Date();
//     return `DateTime: ${d.getDate()}/${(parseInt(d.getMonth()) + 1) + ''}/${d.getFullYear()}`;
// });
// app.use(morgan(`:meth :method; URL: :url:stat :msg :tgl ResponseTime: :response-time ms`,{stream:accessLogStream}));
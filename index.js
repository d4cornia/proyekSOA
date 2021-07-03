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
const stadium = require('./routes/stadium');
app.use('/api/users/', user);
app.use('/api/admin/', admin);
app.use('/api/stadium/', stadium);


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

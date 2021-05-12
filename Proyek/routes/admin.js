const express = require("express");
const multer = require('multer');
const axios = require("axios").default;
const jwt = require('jsonwebtoken');
require('dotenv').config(); // setting up
const db = require("../connection");
const router = express.Router();

// multer config
const storage = multer.diskStorage({
    destination:function(req, file, callback){
        callback(null,'./public/uploads');
    },
    filename:async function(req, file, callback){
        const extension = file.originalname.split('.')[file.originalname.split('.').length-1]
        let filename = '-';
        if(req.body.username){
            filename = req.body.username;
        }else{
            let token = req.headers['x-auth-token'];
            let user = null;
            try{
                user = jwt.verify(token, process.env.secret); // verify token yang dibuat pas login
                // diverify dari file .env dengan nama variable secret
            }catch(e){
                console.log(e);
            }

            console.log(user.username);
            filename = user.username;
        }
        callback(null, (filename+'.'+extension));
    }
});
function checkFileType(file,cb){
    const filetypes= /jpg|png|jpeg/;
    const extname=filetypes.test(file.originalname.split('.')[file.originalname.split('.').length-1]);
    const mimetype=filetypes.test(file.mimetype);
    if(mimetype && extname){
        return cb(null,true);
    }else{
        cb(error = 'Error : foto only!');
    }
}
const upload = multer({
    storage:storage,
    fileFilter: function(req,file,cb){
        checkFileType(file,cb);
    }
});

//fungsi middleware
const {
    cekJWT,
    authSubscriber,
    authAdmin,
    auth,
    cekQuota,
} = require("../middleware");








module.exports = router;
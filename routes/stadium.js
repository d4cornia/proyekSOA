const express = require("express");
const multer = require('multer');
const axios = require("axios").default;
const jwt = require('jsonwebtoken');
require('dotenv').config(); // setting up
const db = require("../connection");
const router = express.Router();
const ShortUniqueId = require('short-unique-id');

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


router.get('/list',async function (req,res) {
    let result;
    if(req.query.name){
        result = await db.query(`SELECT * FROM stadium where nama like'%${req.query.name}%'`);
        if(result.length<=0){
            return res.status(404).json({'error':"Stadium Tidak Ditemukan"});
        }
    }
    else{
        result = await db.query(`SELECT * FROM stadium`);
    }
    
    var data = [];
    result.forEach(element => {
        var jenis = "Editable";
        if(element.status==1){
            jenis = "Not Editable";
        }
        var dt = {
            'Id Stadium' : element.id_stadium,
            'Nama Stadium': element.nama,
            'City Stadium': element.city,
            'Country Stadium': element.country,
            'Capacity Stadium': element.kapasitas,
            'Editable': jenis
        }
        data.push(dt);
    });
    
    return res.status(200).json(data);
   
    
})

router.post('/add',[cekJWT,authAdmin],async function (req,res) {
    const uid = new ShortUniqueId();
    id = uid.stamp(32); 
    data = await db.query(`INSERT INTO stadium VALUES('${id}','${req.body.nama}','${req.body.city}','${req.body.country}','${req.body.kapasitas}','0')`);
    var dt = {
        'Id Stadium' : id,
        'Nama Stadium': req.body.nama,
        'City Stadium': req.body.city,
        'Country Stadium': req.body.country,
        'Capacity Stadium': req.body.kapasitas,
        'Editable': "Editable"
    }
    return res.status(201).json(dt);
});
router.put('/edit',[cekJWT],async function (req,res) {
    var dt = await db.query(`select * from stadium where id_stadium = '${req.body.id_stadium}'`);
    if(dt[0].status==1){
        res.status(400).json({"error":"Stadium Not Editable"});
    }
    else{
        console.log(dt);
        nama = dt[0].nama;
        country = dt[0].country;
        city = dt[0].city;
        kapasitas = dt[0].kapasitas;
        if(req.body.nama!=""){
            nama = req.body.nama;
        }
        if(req.body.country!=""){
            country = req.body.country;
        }
        if(req.body.city!=""){
            city = req.body.city;
        }
        if(req.body.capacity!=""){
            kapasitas = req.body.capacity;
        }
        await db.query(`update stadium set nama='${nama}',city='${city}',country='${country}',kapasitas='${kapasitas}' where id_stadium = '${req.body.id_stadium}'`);
        var dt = await db.query(`select * from stadium where id_stadium = '${req.body.id_stadium}'`);
        var jenis = "Editable";
        if(dt[0].status==1){
            jenis = "Not Editable";
        }
        var dt = {
            'Id Stadium' : dt[0].id_stadium,
            'Nama Stadium': dt[0].nama,
            'City Stadium': dt[0].city,
            'Country Stadium': dt[0].country,
            'Capacity Stadium': dt[0].kapasitas,
            'Editable': jenis
        }
        res.status(201).json(dt);
    }
});
router.delete('/delete/:id_stadium',[cekJWT,authAdmin],async function (req,res) {
    var dt = await db.query(`select * from stadium where id_stadium = '${req.params.id_stadium}'`);
    if(dt[0].status==1){
        res.status(400).json({"error":"Stadium Not Editable Or Delectable"});
    }
    else{
        await db.query(`delete from stadium where id_stadium = '${req.params.id_stadium}'`);
        res.status(200).json({"msg":"Delete Stadium Success!"});
    }
});
module.exports = router;
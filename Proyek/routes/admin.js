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


router.get('/viewUser',[cekJWT,authAdmin],async function (req,res) {
    let result;
    if(req.query.nama){
        result = await db.query(`SELECT * FROM users where nama like'%${req.query.nama}%'`);
        if(result.length<=0){
            return res.status(400).json({'error':"Data Tidak Ditemukan"});
        }
    }
    else{
        result = await db.query(`SELECT * FROM users`);
    }
    
    var data = [];
    result.forEach(element => {
        var mm = "Not Member";
        
        if(element.type==2){
            mm = "Member";
        }

        var dt = {
            'Username' : element.username,
            'Nama User': element.nama,
            'Password User': element.password,
            'No Telepon': element.no_telepon,
            'Email': element.email,
            'Wallet': element.wallet,
            'Status':mm
        }
        data.push(dt);
    });
    return res.status(200).json(data);
   
    
})

router.get('/viewMembership',[cekJWT,authAdmin],async function (req,res) {
    let result;
    if(req.query.nama){
        result = await db.query(`SELECT * FROM users as s,members as m where nama like'%${req.query.nama}%' and s.id_user = m.id_user`);
        if(result.length<=0){
            return res.status(400).json({'error':"Data Tidak Ditemukan"});
        }
    }
    else{
        result = await db.query(`SELECT * FROM users as s,members as m where s.id_user = m.id_user`);
    }
    var data = [];
    result.forEach( element => {
        console.log(element);
        var dt = {
            'Username' : element.username,
            'Member Name' : element.nama,
            'Last Payment ':element.last_payment,
            'Due Date ': element.due_date,
            'Member Since ': element.member_since,
            'Unsubsribe ': element.unsubscribe,
        }
        data.push(dt);
    });
    return res.status(200).json(data);
});

router.get('/refreshStadium',[cekJWT,authAdmin],async function (req,res) {
    var axios = require("axios").default;

    var options = {
    method: 'GET',
    url: 'https://soccer-football-info.p.rapidapi.com/stadiums/list/',
    params: {c: 'all', p: '1'},
    headers: {
        'x-rapidapi-key': '8e4f543e6fmsh137a9d0400df44ap1c3d59jsn090091500313',
        'x-rapidapi-host': 'soccer-football-info.p.rapidapi.com'
    }
    };

    axios.request(options).then( async function (response) {
        dt = response.data.result;
        await db.query("delete from stadium where status=1");
        dt.forEach(async element => {
            try {
                data = await db.query(`INSERT INTO stadium VALUES('${element.id}','${element.name}','${element.city}','${element.country}','${element.capacity}','1')`);
            } catch (error) {}
        });
        res.status(200).json({"Msg":"Load Stadium Succes!"})

    }).catch(function (error) {
        console.error(error);
    });
});



function generateIdTeam(name) {
    var result           = [];
    var characters       = name+'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 16; i++ ) {
        result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join('');
}

// authAdmin
router.get("/team/refresh", [cekJWT, authAdmin], async(req, res) => {
    var options = {
        method: 'GET',
        url: 'https://soccer-football-info.p.rapidapi.com/teams/list/',
        params: {l: 'en_US', c: 'all', p: '1'},
        headers: {
            'x-rapidapi-key': '8e4f543e6fmsh137a9d0400df44ap1c3d59jsn090091500313',
            'x-rapidapi-host': 'soccer-football-info.p.rapidapi.com'
        }
    };
    var arrTeam = [];
    axios.request(options).then(async function (response) {
        var arrTeam = [];
        for (let i = 0; i < 100; i++) {
            arrTeam.push(response.data["result"][i]);
        }
        // res.status(200).json(arrTeam[0].id);
        let query = `Select * from team where status = 0`;
        let result = await db.query(query);

        if(result.length>0){
            // delete dulu
            await db.query(`DELETE FROM team where status = 0`);
            for (let i = 0; i < 100; i++) {
                // console.log()
                await db.query(`INSERT INTO team VALUES("${arrTeam[i].id}","${arrTeam[i].name}","${arrTeam[i].country}",0)`);
            }

            res.status(201).send("Update Refresh Team Success");
        }else{
            // langsung insert
            for (let i = 0; i < 100; i++) {
                // console.log()
                await db.query(`INSERT INTO team VALUES("${arrTeam[i].id}","${arrTeam[i].name}","${arrTeam[i].country}",0)`);
            }

            res.status(201).send("Refresh Team Success");
        }
    }).catch(function (error) {
        console.error(error);
    });
});

router.post("/team/add", [cekJWT, authAdmin], async(req, res) => {
    let nama = req.body.nama;
    let country = req.body.country;
    let query = `Select * from team where nama = "${nama}"`;
    let result = await db.query(query);

    if(result.length>0){
        // nama tim sudah terpakai
        res.status(500).send({error:"Nama Team Sudah dipakai"});
    }else{
        // langsung insert
        let id = generateIdTeam(nama);
        await db.query(`INSERT INTO team VALUES("${id}","${nama}","${country}",1)`);

        res.status(201).send({
            id : id,
            nama : nama,
            country : country,
            status : "Success Add Team"
        });
    }
});

router.put("/team/update/:id", [cekJWT, authAdmin], async(req, res) => {
    let id = req.params.id;
    let nama = req.body.nama;
    let country = req.body.country;
    let query = `Select * from team where id_team = "${id}"`;
    var result = await db.query(query);

    if(result.length==0){
        // nama tim sudah terpakai
        res.status(404).send({error:"Team Tidak ditemukan"});
    }else{
        // langsung insert
        // let id = generateIdTeam(nama);
        if(result[0].status==0){
            res.status(500).send({error:"Data Tidak bisa diedit karena data asli"});
        }else{
            await db.query(`UPDATE team SET nama = "${nama}", country = "${country}" WHERE id_team='${id}'`);
        }


        res.status(200).send({
            id : id,
            nama_lama : result[0].nama,
            nama_baru : nama,
            country_lama : result[0].country,
            country_baru : country,
            status : "Success Update Team"
        });
    }
});

router.delete("/team/update/:id", [cekJWT, authAdmin], async(req, res) => {
    let id = req.params.id;
    let query = `Select * from team where id_team = "${id}"`;
    var result = await db.query(query);

    if(result.length==0){
        // nama tim sudah terpakai
        res.status(404).send({error:"Team Tidak ditemukan"});
    }else{
        // langsung insert
        // let id = generateIdTeam(nama);
        if(result[0].status==0){
            res.status(500).send({error:"Data Tidak bisa dihapus karena data asli"});
        }else{
            await db.query(`Delete from team WHERE id_team='${id}'`);
        }


        res.status(200).send({
            id : id,
            nama : result[0].nama,
            country : result[0].country,
            status : "Success Delete Team"
        });
    }
});

router.get("/team/viewAll", [cekJWT, authAdmin], async(req, res) => {
    // let id = req.params.id;
    let query = `Select * from team`;
    var result = await db.query(query);

    var arrTeam = [];

    if(result.length==0){
        res.status(404).send({error:"Team Tidak Tersedia"});
    }else{

        for (let i = 0; i < result.length; i++) {
            let stat = "";
            if(result[i].status==0){
                stat = "Data Asli";
            }else{
                stat = "Data Insert";
            }

            arrTeam.push(
                nama=>result[i].nama,
                status=>stat
            )

        }


        res.status(200).send({
            arrTeam
        });
    }
});



module.exports = router;
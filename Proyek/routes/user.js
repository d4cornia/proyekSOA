const express = require("express");
const multer = require('multer');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // setting up
const db = require("../connection");
const router = express.Router();
const axios = require("axios").default;

let udata = [];


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


// add in function
const genKodeKelas = (length) => {
    const alphabets= 'abcdefghijklmnopqrstuvwxyz'.split('');

    let key= '';

    for (let i= 0; i < length; i++) {
        let hash= Math.floor(Math.random()*2)+1;
        let model= Math.floor(Math.random()*2)+1;
        let randAlpha= Math.floor(Math.random()*alphabets.length);

        if (hash === 1) {
            key+= Math.floor(Math.random()*10);
        } else {
            if (model === 1) key+= alphabets[randAlpha].toUpperCase();
            else key+= alphabets[randAlpha];
        }
    }

    return key;
};


router.get('/keLogin', (req,res) => {
    req.headers['x-auth-token'] = null;
    return res.render('pages/login',{
        message:"",
        errorMessage:"",
        resultArr:[]
    });
});

router.get('/keReg', (req,res) => {
    return res.render('pages/register',{
        message:"",
        errorMessage:"",
        resultArr:[]
    });
});


router.post('/api/users/register', async (req,res)=> {
    // let isUpperLowerNumber = /^(?![A-Z]+$)(?![a-z]+$)(?![0-9]+$)(?![A-Z0-9]+$)(?![a-z0-9]+$)[0-9A-Za-z]+$/.test(req.body.test);
    // let tgl = req.body.tanggal_peminjaman.split("-");
    // await db.query(`INSERT INTO PEMINJAMAN VALUES('${}','${}',STR_TO_DATE('${(tgl[0] + " " + tgl[1] + " " + tgl[2])}','%d %m %Y'),'${}')`);
    try {
        if(req.body.notelp &&req.body.uname && req.body.nama && req.body.email && req.body.cpass && req.body.pass){
            // cek no telp angka saja
            let num = /^\d+$/.test(req.body.notelp);
            if(!num) {
                return res.status(400).render('pages/register', {
                    message: "",
                    errorMessage: "No telepon harus angka semua!",
                    resultArr: []
                });
            }

            // cek cpass dan pass
            if(req.body.pass != req.body.cpass){
                return res.status(400).render('pages/register',{
                    message:"",
                    errorMessage:"Password dan confirm password harus sama!",
                    resultArr:[]
                });
            }

            // cek tidak ada usernmae dan email kembar
            let resu = await db.query(`SELECT * FROM USERS WHERE username='${req.body.uname}' OR email='${req.body.email}'`);
            if(resu.length > 0){
                return res.status(400).render('pages/register', {
                    message: "",
                    errorMessage: "Username / Email telah dipakai!",
                    resultArr: []
                });
            }

            // tipe user
            // 0 = admin
            // 1 = biasa
            // 2 = subscriber

            await db.query(`INSERT INTO USERS VALUES('','${req.body.notelp}','${req.body.uname}','${req.body.nama}','${req.body.email}', '1','${req.body.pass}', 0)`);

            return res.status(201).render('pages/register', {
                message: "Regristrasi Berhasil, user " + req.body.nama + "!",
                errorMessage: "",
                resultArr: []
            });
        }else{
            return res.status(400).render('pages/register', {
                message: "",
                errorMessage: "Inputan belum lengkap!",
                resultArr: []
            });
        }
    } catch (error) {
        console.log(error);
    }
});

router.post('/api/users/login', async (req,res)=> {
    if(req.body.uname && req.body.pass){

        let resu = await db.query(`SELECT * FROM users WHERE username='${req.body.uname}' AND password='${req.body.pass}'`);

        if(resu.length == 0){
            return res.status(400).render('pages/login', {
                message: "",
                errorMessage: "Username/Password salah!",
                resultArr: []
            });
        }

        // membuat token dari jwt
        let token = jwt.sign({
                'username':req.body.uname,
                'password':req.body.pass
            },
            process.env.secret
        );
        req.headers['x-auth-token'] = token;

        let listBola = await axios.get(`https://pokeapi.co/api/v2/type`);
        udata = {
            'nama': resu[0].nama,
            'listBola': listBola.data.results
        }

        return res.status(201).render('pages/home', {
            message: "Login Berhasil",
            errorMessage: "",
            resultArr: udata
        });
    }else{
        return res.status(400).render('pages/login', {
            message: "",
            errorMessage: "Inputan belum lengkap!",
            resultArr: []
        });
    }
});

router.get('/api/users/home', cekJWT, async (req,res)=>{
    udata = {

    }
    return res.status(200).render('pages/home',{
        message:"",
        errorMessage:"",
        resultArr: udata
    });
})

router.post('/api/users/topup', cekJWT, async (req,res)=> {
    try {
        if(req.body.value){
            if(req.body.value <= 0){
                return res.status(400).render('pages/home', {
                    message: "",
                    errorMessage: "Topup harus lebih besar dari 0!",
                    resultArr: []
                });
            }
            await db.query(`UPDATE users SET wallet=${(req.user.wallet + req.body.value)} WHERE id_user='${req.user.id_user}'`);

            return res.status(200).render('pages/home',{
                message:"",
                errorMessage:"",
                resultArr: udata
            });
        }else{
            return res.status(400).render('pages/login', {
                message: "",
                errorMessage: "Inputan belum lengkap!",
                resultArr: []
            });
        }
    } catch (error) {
        console.log(error);
    }
});

router.post('/api/users/membership', cekJWT, async (req,res)=>{
    let resu = await db.query(`SELECT * FROM MEMBERS WHERE id_user='${req.user.id_user}'`);
    let d = new Date();
    let since = d.getDate() + "-" + (parseInt(d.getMonth()) + 1) + "-" + d.getFullYear();
    if(resu.length == 0){
        // due date daftar baru 1 bulan
        let newduedate = d.getDate() + "-" + (parseInt(d.getMonth()) + 2) + "-" + d.getFullYear();
        // kalo belum terdaftar, insert
        await db.query(`INSERT INTO MEMBERS VALUES('','${req.user.id_user}', '-', '${newduedate}', '${since}', '-')`);
        return res.status(201).render('pages/home',{
            message:"Berhasil subscribe sebagai member!",
            errorMessage:"",
            resultArr: udata
        });
    }

    // kalo sudah terdaftar update
    // due date daftar ulang 1 hari
    let newduedate = (parseInt(d.getDate()) + 1)  + "-" + (parseInt(d.getMonth()) + 1) + "-" + d.getFullYear();
    await db.query(`UPDATE MEMBERS SET due_date = '${newduedate}', member_since = '${since}' WHERE id_user='${req.user.id_user}'`);
    return res.status(200).render('pages/home',{
        message:"Berhasil subscribe kembali sebagai member!",
        errorMessage:"",
        resultArr: udata
    });
})

router.delete('/api/users/membership', (cekJWT, authSubscriber), async (req,res)=> {
    let d = new Date();
    let now = d.getDate() + "-" + (parseInt(d.getMonth()) + 1) + "-" + d.getFullYear();
    await db.query(`UPDATE MEMBERS SET unsubscribe = '${now}' WHERE id_user='${req.user.id_user}'`);
    await db.query(`UPDATE USERS SET TYPE = 1 WHERE id_user='${req.user.id_user}'`);
    return res.status(200).render('pages/home',{
        message:"Berhasil unsubscribe member!",
        errorMessage:"",
        resultArr: udata
    });
});

let cost = 100000;
router.get('api/users/membership/tagihan', (cekJWT, authSubscriber), async (req, res)=>{
    let resu = await db.query(`SELECT * FROM MEMBERS WHERE id_user='${req.user.id_user}'`);
    if(resu.length == 0){
        return res.status(404).render('pages/home', {
            message: "",
            errorMessage: "Member not found!",
            resultArr: []
        });
    }

    // cek jika tanggal due date - 1 bulan dibawah tanggal last payments maka hitung tagihan else lunas
    let tgl = resu.due_date.split("-");
    let duedate = new Date(parseInt(tgl[2]), parseInt(tgl[1]) - 2, tgl[0]);
    tgl = resu.last_payment.split("-");
    let lastpayment = new Date(parseInt(tgl[2]), parseInt(tgl[1]) - 1, tgl[0]);

    if(duedate.getTime() <= lastpayment.getTime()){
        // sudah bayar
        udata = {
            'tagihan': 'Lunas'
        }
        return res.status(200).render('pages/home',{
            message:"",
            errorMessage:"",
            resultArr: udata
        });
    }

    let tagihan = cost;
    udata = {
        'tagihan': tagihan
    }
    return res.status(200).render('pages/home',{
        message:"",
        errorMessage:"",
        resultArr: udata
    });
});

router.post('api/users/membership/bayar', (cekJWT, authSubscriber), async (req, res)=> {
    if(req.user.wallet - cost < 0){
        return res.status(400).render('pages/home',{
            message:"",
            errorMessage:"Wallet anda tidak cukup, Harap Topup untuk membayar tagihan!",
            resultArr: udata
        });
    }
    // kurangin wallet
    await db.query(`UPDATE USERS SET wallet = ${(req.user.wallet - cost)} WHERE id_user='${req.user.id_user}'`);
    // update last payment
    let now = d.getDate() + "-" + (parseInt(d.getMonth()) + 1) + "-" + d.getFullYear();
    await db.query(`UPDATE MEMBERS SET last_payment = '${now}' WHERE id_user='${req.user.id_user}'`);
    // insert ke history payment
    let resu = await db.query(`SELECT * FROM MEMBERS WHERE id_user = '${req.user.id_user}'`);
    await db.query(`INSERT INTO PAYMENTS VALUES('','${resu[0].id_member}',${now}, ${cost})`);

    udata = {

    }
    return res.status(200).render('pages/home',{
        message:"Berhasil membayar tagihan!",
        errorMessage:"",
        resultArr: udata
    });
});

router.get('api/users/membership/history', (cekJWT, authSubscriber), async (req,res)=>{
    let resu = await db.query(`SELECT * FROM MEMBERS WHERE id_user = '${req.user.id_user}'`);
    let history =  await db.query(`SELECT * FROM PAYMENT WHERE id_member='${resu[0].id_member}'`);

    udata = {
        'history': history
    }
    return res.status(200).render('pages/home',{
        message:"",
        errorMessage:"",
        resultArr: udata
    });
});

router.get("api/users/matches/:league/:season/:team_id", async(req, res) => {
    let  options = {
        method: 'GET',
        url: 'https://sportsop-soccer-sports-open-data-v1.p.rapidapi.com/v1/leagues/%7Bleague_slug%7D/seasons/%7Bseason_slug%7D/rounds',
        params: {team_identifier: '{team_identifier}'},
        headers: {
            'x-rapidapi-key': '29ef7b5d80mshf99c29e9bea4d85p13145ajsne1780ed3ada5',
            'x-rapidapi-host': 'sportsop-soccer-sports-open-data-v1.p.rapidapi.com'
        }
    };

    axios.request(options).then(function (response) {
        res.status(200).json(response.data);
    }).catch(function (error) {
        console.error(error);
    });
});

router.get("api/users/topscorer/:league/:season", async(req, res) => {

});

module.exports = router;
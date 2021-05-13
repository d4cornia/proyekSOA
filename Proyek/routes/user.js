const express = require("express");
const multer = require('multer');
const axios = require("axios").default;
const jwt = require('jsonwebtoken');
require('dotenv').config(); // setting up
const db = require("../connection");
const router = express.Router();

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
    await db.query(`INSERT INTO PAYMENTS VALUES('','${resu[0].id_member}',${now}, ${})`);

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




// no 5
app.post('/api/tickets/add', cekJWT, async (req,res)=>{

    if(req.body.stasiun_asal && req.body.stasiun_tujuan && req.body.jadwal_keberangkatan && req.body.jadwal_tiba && req.body.harga){
        if(req.user.admin == 0){
            return res.status(401).json({
                'msg': 'Bukan admin!'
            });
        }

        let kode = 'T';
        let resu = await db.query(`SELECT * FROM tickets`);
        if((resu.length + 1) < 10){
            kode += '000' + (resu.length + 1);
        }else if((resu.length + 1) < 100){
            kode += '00' + (resu.length + 1);
        }else if((resu.length + 1) < 1000){
            kode += '0' + (resu.length + 1);
        }else{
            kode += (resu.length + 1);
        }

        let jampergi = req.body.jadwal_keberangkatan.split(":");
        let jamsampai = req.body.jadwal_tiba.split(":");

        await db.query(`INSERT INTO tickets VALUES('${kode}', '${req.body.stasiun_asal}', '${req.body.stasiun_tujuan}', STR_TO_DATE('${(jampergi[0] + " " + jampergi[1])}','%H %i'), STR_TO_DATE('${(jamsampai[0] + " " + jamsampai[1])}','%H %i'), ${req.body.harga})`);

        return res.status(201).json({
            'kode_tiket': kode,
            'stasiun_asal': req.body.stasiun_asal,
            'stasiun_tujuan': req.body.stasiun_tujuan,
            'jadwal_keberangkatan': req.body.jadwal_keberangkatan,
            'jadwal_tiba': req.body.jadwal_tiba,
            'harga': req.body.harga,
        });
    }else{
        return res.status(400).json({
            'msg': 'Inputan belum lengkap'
        });
    }
});

// no 6
app.get('/api/tickets', cekJWT, async (req,res)=> {
    if(req.query.stasiun_asal && req.query.stasiun_tujuan) {
        let resu = await db.query(`SELECT kode as kode_tiket, asal as stasiun_asal, tujuan as stasiun_tujuan, harga FROM tickets WHERE upper(asal) LIKE upper('%${req.query.stasiun_asal}%') AND upper(TUJUAN) LIKE upper('%${req.query.stasiun_tujuan}%')`);

        return res.status(200).json(resu);
    }else if(req.query.stasiun_asal){
        let resu = await db.query(`SELECT kode as kode_tiket, asal as stasiun_asal, tujuan as stasiun_tujuan, harga FROM tickets WHERE upper(asal) LIKE upper('%${req.query.stasiun_asal}%')`);

        return res.status(200).json(resu);
    }else if(req.query.stasiun_tujuan){
        let resu = await db.query(`SELECT kode as kode_tiket, asal as stasiun_asal, tujuan as stasiun_tujuan, harga FROM tickets WHERE upper(TUJUAN) LIKE upper('%${req.query.stasiun_tujuan}%')`);

        return res.status(200).json(resu);
    } else{
        let resu = await db.query(`SELECT kode as kode_tiket, asal as stasiun_asal, tujuan as stasiun_tujuan, harga FROM tickets`);

        return res.status(200).json(resu);
    }
});

// no 7
app.post('/api/tickets/buy', cekJWT,async (req,res)=>{
    if(req.body.kode_tiket && req.body.jumlah){
        let kode = 'TIC';
        let resu = await db.query(`SELECT * FROM transaksi`);
        if((resu.length + 1) < 10){
            kode += '0000' + (resu.length + 1);
        }else if((resu.length + 1) < 100){
            kode += '000' + (resu.length + 1);
        }else if((resu.length + 1) < 1000){
            kode += '00' + (resu.length + 1);
        }else if((resu.length + 1) < 10000){
            kode += '0' + (resu.length + 1);
        }else{
            kode += (resu.length + 1);
        }

        resu = await db.query(`SELECT * FROM tickets WHERE KODE = '${req.body.kode_tiket}'`);
        if(resu.length == 0){
            return res.status(404).json({
                'msg': 'Ticket not found!'
            });
        }

        await db.query(`INSERT INTO transaksi VALUES('${kode}', '${req.user.username}','${req.body.kode_tiket}', ${req.body.jumlah}, ${(parseInt(req.body.jumlah + "") * parseInt(resu[0].harga))})`);

        return res.status(201).json({
            'kode_transaksi': kode,
            'username': req.user.username,
            'kode_tiket': req.body.kode_tiket,
            'jumlah': req.body.jumlah,
            'total': (parseInt(req.body.jumlah + "") * parseInt(resu[0].harga))
        });
    }else{
        return res.status(400).json({
            'msg': 'Inputan belum lengkap'
        });
    }
});

//no 8
app.get('/api/tickets/history', cekJWT, async (req,res)=>{
    if(req.user.admin == 1){
        let resu = await db.query(`SELECT kode as kode_transaksi, kode_tiket, jumlah, total FROM transaksi`);
        return res.status(200).json(resu);
    }else{
        let resu = await db.query(`SELECT kode as kode_transaksi, kode_tiket, kode_user as username, jumlah, total FROM transaksi WHERE kode_user='${req.user.username}'`);
        return res.status(200).json(resu);
    }
});

module.exports = router;
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
    cekTagihanBulanLalu,
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


router.post('/register', async (req,res)=> {
    // let isUpperLowerNumber = /^(?![A-Z]+$)(?![a-z]+$)(?![0-9]+$)(?![A-Z0-9]+$)(?![a-z0-9]+$)[0-9A-Za-z]+$/.test(req.body.test);
    // let tgl = req.body.tanggal_peminjaman.split("-");
    // await db.query(`INSERT INTO PEMINJAMAN VALUES('${}','${}',STR_TO_DATE('${(tgl[0] + " " + tgl[1] + " " + tgl[2])}','%d %m %Y'),'${}')`);
    try {
        if(req.body.no_telepon && req.body.username && req.body.nama && req.body.email && req.body.confirm_password && req.body.password){
            // cek no telp angka saja
            let num = /^\d+$/.test(req.body.no_telepon);
            if(!num) {
                return res.status(400).json({
                    'error msg': 'No telepon harus angka semua!'
                });
            }

            // cek cpass dan pass
            if(req.body.password != req.body.confirm_password){
                return res.status(400).json({
                    'error msg': 'Password dan Confirm password harus sama!'
                });
            }

            // cek tidak ada usernmae dan email kembar
            let resu = await db.query(`SELECT * FROM USERS WHERE username='${req.body.username}' OR email='${req.body.email}'`);
            if(resu.length > 0){
                return res.status(400).json({
                    'error msg': 'Username / Email telah digunakan!'
                });
            }

            // tipe user
            // 0 = admin
            // 1 = biasa
            // 2 = subscriber

            await db.query(`INSERT INTO USERS VALUES('','${req.body.no_telepon}','${req.body.username}','${req.body.nama}','${req.body.email}', '1','${req.body.password}', 0)`);

            return res.status(201).json({
                'No Telepon': req.body.no_telepon,
                'Username' : req.body.username,
                'Nama User': req.body.nama,
                'Status': 'Register Berhasil!'
            });
        }else{
            return res.status(400).json({
                'error msg': 'Inputan Belum lengkap!'
            });
        }
    } catch (error) {
        console.log(error);
    }
});

router.post('/login', async (req,res)=> {
    if(req.body.username && req.body.password){

        let resu = await db.query(`SELECT * FROM users WHERE username='${req.body.username}' AND password='${req.body.password}'`);

        if(resu.length == 0){
            return res.status(400).json({
                'error msg': 'Username/Password salah!'
            });
            /*return res.status(400).render('pages/login', {
                message: "",
                errorMessage: "Username/Password salah!",
                resultArr: []
            });*/
        }

        // membuat token dari jwt
        let token = jwt.sign({
                'username':req.body.username,
                'password':req.body.password
            },
            process.env.secret
        );
        req.headers['x-auth-token'] = token;

        /*let listBola = await axios.get(`https://pokeapi.co/api/v2/type`);
        udata = {
            'nama': resu[0].nama,
            'listBola': listBola.data.results
        }*/

        return res.status(200).json({
            'Nama User': resu[0].nama,
            'Status': 'Login Berhasil!',
            'Token' : token
        });
    }else{
        return res.status(400).json({
            'error msg': 'Inputan Belum lengkap!'
        });
        /*return res.status(400).render('pages/login', {
            message: "",
            errorMessage: "Inputan belum lengkap!",
            resultArr: []
        });*/
    }
});

/*
router.get('/home', cekJWT, async (req,res)=>{
    udata = {

    }
    return res.status(200).render('pages/home',{
        message:"",
        errorMessage:"",
        resultArr: udata
    });
})
*/

router.get('/wallet', cekJWT, async (req,res)=> {
    let resu = await db.query(`SELECT * FROM users WHERE id_user='${req.user.id_user}'`);

    return res.status(200).json({
        'Nama User': req.user.nama,
        'Wallet': parseInt(resu[0].wallet)
    });
});

router.post('/topup', cekJWT, async (req,res)=> {
    try {
        if(req.body.value){
            if(req.body.value <= 0){
                return res.status(400).json({
                    'error msg': 'Topup harus lebih besar dari 0!'
                });
                /*return res.status(400).render('pages/home', {
                    message: "",
                    errorMessage: "Topup harus lebih besar dari 0!",
                    resultArr: []
                });*/
            }
            await db.query(`UPDATE users SET wallet=${(parseInt(req.user.wallet) + parseInt(req.body.value))} WHERE id_user='${req.user.id_user}'`);

            return res.status(200).json({
                'Nama User': req.user.nama,
                'Wallet': (parseInt(req.user.wallet) + parseInt(req.body.value)),
                'Status' : 'Topup sebesar ' + req.body.value + ' Berhasil!'
            });
        }else{
            return res.status(400).json({
                'error msg': 'Inputan Belum lengkap!'
            });
        }
    } catch (error) {
        console.log(error);
    }
});

router.post('/membership', cekJWT, async (req,res)=>{
    let resu = await db.query(`SELECT * FROM MEMBERS WHERE id_user='${req.user.id_user}'`);
    let d = new Date();
    let since = d.getDate() + "-" + (parseInt(d.getMonth()) + 1) + "-" + d.getFullYear();
    if(resu.length == 0){
        // end date daftar baru 1 bulan
        let newenddate = d.getDate() + "-" + (parseInt(d.getMonth()) + 2) + "-" + d.getFullYear();
        // kalo belum terdaftar, insert
        await db.query(`INSERT INTO MEMBERS VALUES('','${req.user.id_user}', '-', '${newenddate}', '${since}', '-')`);
        // Update tipe member
        await db.query(`UPDATE USERS SET TYPE = 2 WHERE id_user='${req.user.id_user}'`);

        return res.status(200).json({
            'Nama User': req.user.nama,
            'Status': 'Berhasil subscribe sebagai member!',
            'Subscription Date': since,
            'End Date': newenddate
        });
        /*return res.status(201).render('pages/home',{
            message:"Berhasil subscribe sebagai member!",
            errorMessage:"",
            resultArr: udata
        });*/
    }

    if(req.user.type != 1){
        return res.status(400).json({
            'error msg': 'Anda masih menjadi subscriber!'
        });
    }
    // kalo sudah terdaftar update harus bayar baru bisa menjadi member
    let sisa = (parseInt(req.user.wallet) - cost);
    if(sisa < 0){
        return res.status(400).json({
            'Nama User': req.user.nama,
            'Tagihan': cost,
            'Wallet': req.user.wallet,
            'Status': 'Wallet tidak mencukupi!'
        });
    }
    let newenddate = (parseInt(d.getDate()))  + "-" + (parseInt(d.getMonth()) + 2) + "-" + d.getFullYear();
    await db.query(`UPDATE MEMBERS SET last_payment = '${since}', end_date = '${newenddate}', member_since = '${since}', unsubscribe = '-' WHERE id_user='${req.user.id_user}'`);
    // Update tipe member
    await db.query(`UPDATE USERS SET wallet = ${sisa}, TYPE = 2 WHERE id_user='${req.user.id_user}'`);
    // insert ke history payment
    resu = await db.query(`SELECT * FROM MEMBERS WHERE id_user = '${req.user.id_user}'`);
    await db.query(`INSERT INTO PAYMENTS VALUES('','${resu[0].id_member}', '${since}', ${cost}), 'Bayar Subcribe menjadi Membership Kembali'`);

    return res.status(200).json({
        'Nama User': req.user.nama,
        'Status': 'Berhasil subscribe kembali sebagai member',
        'Subscription Date': since,
        'End Date': newenddate,
        'Wallet': sisa
    });
    /*return res.status(200).render('pages/home',{
        message:"Berhasil subscribe kembali sebagai member!",
        errorMessage:"",
        resultArr: udata
    });*/
})

router.delete('/membership', [cekJWT, authSubscriber], async (req,res)=> {
    let resu = await db.query(`SELECT * FROM MEMBERS WHERE id_user='${req.user.id_user}'`);

    let tgl = resu[0].last_payment.split("-");
    let lastpayment = new Date(parseInt(tgl[2]), parseInt(tgl[1]) - 1, tgl[0]);
    tgl = resu[0].end_date.split("-");
    let enddate = new Date(parseInt(tgl[2]), parseInt(tgl[1]) - 2, tgl[0]);

    if(lastpayment.getTime() < enddate.getTime()){
        // belum bayar
        return res.status(400).json({
            'error msg': 'Harap bayar tagihan yang belum lunas untuk unsubscribe!'
        });
    }

    let d = new Date();
    let now = d.getDate() + "-" + (parseInt(d.getMonth()) + 1) + "-" + d.getFullYear();
    await db.query(`UPDATE MEMBERS SET unsubscribe = '${now}' WHERE id_user='${req.user.id_user}'`);
    await db.query(`UPDATE USERS SET TYPE = 1 WHERE id_user='${req.user.id_user}'`);
    return res.status(200).json({
        'Nama User': req.user.nama,
        'Status': 'Sukses unsubscribe member',
        'Date unsubscribe': now
    });
    /*return res.status(200).render('pages/home',{
        message:"Berhasil unsubscribe member!",
        errorMessage:"",
        resultArr: udata
    });*/
});

let cost = 100000;
router.get('/membership/tagihan', [cekJWT, authSubscriber], async (req, res)=>{
    let resu = await db.query(`SELECT * FROM MEMBERS WHERE id_user='${req.user.id_user}'`);
    if(resu.length == 0){
        return res.status(400).json({
            'error msg': 'Member not found!'
        });
        /*return res.status(404).render('pages/home', {
            message: "",
            errorMessage: "Member not found!",
            resultArr: []
        });*/
    }

    // cek jika tanggal end date - 1 bulan dibawah tanggal last payments maka hitung tagihan else lunas
    let tgl = resu[0].last_payment.split("-");
    let lastpayment = new Date(parseInt(tgl[2]), parseInt(tgl[1]) - 1, tgl[0]);
    tgl = resu[0].end_date.split("-");
    let enddate = new Date(parseInt(tgl[2]), parseInt(tgl[1]) - 2, tgl[0]);

    if(lastpayment.getTime() >= enddate.getTime()){
        // sudah bayar
        return res.status(200).json({
            'Nama User': req.user.nama,
            'Pembayaran Terakhir': resu[0].last_payment,
            'End Date': resu[0].end_date,
            'Tagihan Bulan ini': 'Lunas'
        });
        /*udata = {
            'tagihan': 'Lunas'
        }
        return res.status(200).render('pages/home',{
            message:"",
            errorMessage:"",
            resultArr: udata
        });*/
    }

    let tagihan = cost;

    return res.status(200).json({
        'Nama User': req.user.nama,
        'Pembayaran Terakhir': resu[0].last_payment,
        'End Date': resu[0].end_date,
        'Tagihan Bulan ini': tagihan
    });
    /*udata = {
        'tagihan': tagihan
    }
    return res.status(200).render('pages/home',{
        message:"",
        errorMessage:"",
        resultArr: udata
    });*/
});

router.post('/membership/bayar', [cekJWT, authSubscriber], async (req, res)=> {
    let resu = await db.query(`SELECT * FROM MEMBERS WHERE id_user='${req.user.id_user}'`);

    // cek jika tanggal end date - 1 bulan dibawah tanggal last payments maka bayar else lunas
    let tgl = resu[0].last_payment.split("-");
    let lastpayment = new Date(parseInt(tgl[2]), parseInt(tgl[1]) - 1, tgl[0]);
    tgl = resu[0].end_date.split("-");
    let enddate = new Date(parseInt(tgl[2]), parseInt(tgl[1]) - 2, tgl[0]);
    if(lastpayment.getTime() >= enddate.getTime()){
        // sudah bayar
        return res.status(200).json({
            'Nama User': req.user.nama,
            'Pembayaran Terakhir': resu[0].last_payment,
            'End Date': resu[0].end_date,
            'Tagihan Bulan ini': 'Lunas'
        });
        /*udata = {
            'tagihan': 'Lunas'
        }
        return res.status(200).render('pages/home',{
            message:"",
            errorMessage:"",
            resultArr: udata
        });*/
    }

    let sisa = (parseInt(req.user.wallet) - cost);
    if(sisa < 0){
        return res.status(400).json({
            'Nama User': req.user.nama,
            'Tagihan': cost,
            'Wallet': sisa,
            'Status': 'Wallet tidak mencukupi!'
        });
    }

    // kurangin wallet
    let d = new Date();
    await db.query(`UPDATE USERS SET wallet = ${sisa} WHERE id_user='${req.user.id_user}'`);

    // update last payment
    let now = d.getDate() + "-" + (parseInt(d.getMonth()) + 1) + "-" + d.getFullYear();
    await db.query(`UPDATE MEMBERS SET last_payment = '${now}' WHERE id_user='${req.user.id_user}'`);

    // insert ke history payment
    resu = await db.query(`SELECT * FROM MEMBERS WHERE id_user = '${req.user.id_user}'`);
    await db.query(`INSERT INTO PAYMENTS VALUES('','${resu[0].id_member}', '${now}', ${cost}, 'Bayar Tagihan Bulanan')`);

    return res.status(200).json({
        'Nama User': req.user.nama,
        'Tanggal Pembayaran': now,
        'Wallet': sisa,
        'Status': 'Berhasil membayar tagihan bulan ini'
    });
    /*udata = {

    }
    return res.status(200).render('pages/home',{
        message:"Berhasil membayar tagihan!",
        errorMessage:"",
        resultArr: udata
    });*/
});

router.post('/membership/extend', [cekJWT, authSubscriber, cekTagihanBulanLalu], async (req, res) =>{
    // extend end date
    let d = new Date();
    console.log(d.getMonth());
    let newenddate = (parseInt(d.getDate()))  + "-" + (parseInt(d.getMonth()) + 2) + "-" + d.getFullYear();
    await db.query(`UPDATE MEMBERS SET end_date = '${newenddate}' WHERE id_user='${req.user.id_user}'`);
    return res.status(200).json({
        'Nama User': req.user.nama,
        'End date': newenddate,
        'Status': 'Berhasil Extend End date subscription!'
    });
});

router.get('/membership/history', [cekJWT, authSubscriber], async (req,res)=>{
    let resu = await db.query(`SELECT * FROM MEMBERS WHERE id_user = '${req.user.id_user}'`);
    let history =  await db.query(`SELECT * FROM PAYMENTS WHERE id_member='${resu[0].id_member}'`);

    let his = [];
    for (let i = 0; i < history.length; i++) {
        his.push({
            'Nama User': req.user.nama,
            'Id payment': history[i].id_payment,
            'Tanggal Payment': history[i].tanggal_payment,
            'Value': history[i].value,
            'Keterangan': history[i].keterangan
        });
    }

    return res.status(200).json(his);
    /*udata = {
        'history': history
    }
    return res.status(200).render('pages/home',{
        message:"",
        errorMessage:"",
        resultArr: udata
    });*/
});

router.get("/matches/:league/:season/:team_id", [cekJWT], async(req, res) => {
    let options = {
        method: 'GET',
        url: `https://sportsop-soccer-sports-open-data-v1.p.rapidapi.com/v1/leagues/${req.params.league}/seasons/${req.params.season}/rounds`,
        params: {team_identifier: `{${req.params.season}}`},
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

router.get("/topscorer/:league/:season", [cekJWT], async(req, res) => {
    let options = {
        method: 'GET',
        url: `https://sportsop-soccer-sports-open-data-v1.p.rapidapi.com/v1/leagues/${req.params.league}/seasons/${req.params.season}//topscorers`,
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

module.exports = router;
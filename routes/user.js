const express = require("express");
const multer = require('multer');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // setting up
const db = require("../connection");
const router = express.Router();
const axios = require("axios").default;


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
    cekMembershipExpired,
    cekTagihanBulanLalu,
} = require("../middleware");


// add in function
const genKodeAPI = (length) => {
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



// endpoints user
router.post('/register', upload.single("foto"), async (req,res)=> {
    // let isUpperLowerNumber = /^(?![A-Z]+$)(?![a-z]+$)(?![0-9]+$)(?![A-Z0-9]+$)(?![a-z0-9]+$)[0-9A-Za-z]+$/.test(req.body.test);
    // let tgl = req.body.tanggal_peminjaman.split("-");
    // await db.query(`INSERT INTO PEMINJAMAN VALUES('${}','${}',STR_TO_DATE('${(tgl[0] + " " + tgl[1] + " " + tgl[2])}','%d %m %Y'),'${}')`);
    try {
        let dir = './public/uploads/' + req.file.filename;
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
            let resu = await db.query(`SELECT * FROM users WHERE username='${req.body.username}' OR email='${req.body.email}'`);
            if(resu.length > 0){
                return res.status(400).json({
                    'error msg': 'Username / Email telah digunakan!'
                });
            }

            // tipe user
            // 0 = admin
            // 1 = biasa
            // 2 = subscriber
            let api_key = genKodeAPI(20);
            await db.query(`INSERT INTO users VALUES(null,'${req.body.no_telepon}','${req.body.username}','${req.body.nama}','${req.body.email}', '1','${req.body.password}', 0,'${dir}', '${api_key}')`);

            return res.status(201).json({
                'No Telepon': req.body.no_telepon,
                'Username' : req.body.username,
                'Nama User': req.body.nama,
                'API Key': api_key,
                'Status': 'Register Berhasil!'
            });
        }else{
            return res.status(400).json({
                'error msg': 'Inputan Belum lengkap!'
            });
        }
    } catch (error) {
        return res.status(400).json({
            'error msg': 'File foto belum dimasukkan!'
        });
        console.log(error);
    }
});

router.post('/apikey', async(req,res)=>{
    if(req.body.username && req.body.password){
        let resu = await db.query(`SELECT * FROM users WHERE username='${req.body.username}'`);
        if(resu.length == 0){
            return res.status(404).json({
                'error msg': 'Username tidak ditemukan!'
            });
        }

        resu = await db.query(`SELECT * FROM users WHERE username='${req.body.username}' AND password='${req.body.password}'`);
        if(resu.length == 0){
            return res.status(400).json({
                'error msg': 'Username / Password salah!'
            });
        }

        return res.status(200).json({
            'Nama User': resu[0].nama,
            'API Key': resu[0].api_key
        });
    }else{
        return res.status(400).json({
            'error msg': 'Inputan Belum lengkap!'
        });
    }
});

router.post('/login', async (req,res)=> {
    if(req.body.api_key){

        let resu = await db.query(`SELECT * FROM users WHERE api_key='${req.body.api_key}'`);

        if(resu.length == 0) {
            return res.status(400).json({
                'error msg': 'Username/Password salah!'
            });
        }

        // membuat token dari jwt
        let token = jwt.sign({
                'username':resu[0].username,
                'password':resu[0].password
            },
            process.env.secret
        );
        req.headers['x-auth-token'] = token;

        return res.status(200).json({
            'Nama User': resu[0].nama,
            'Status': 'Login Berhasil!',
            'Token' : token
        });
    }else{
        return res.status(400).json({
            'error msg': 'Inputan Belum lengkap!'
        });
    }
});

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
    let resu = await db.query(`SELECT * FROM members WHERE id_user='${req.user.id_user}'`);
    let d = new Date();
    let since = d.getDate() + "-" + (parseInt(d.getMonth()) + 1) + "-" + d.getFullYear();
    let newenddate = '-';
    if(resu.length == 0){
        // end date daftar baru 1 bulan
        if(parseInt(d.getMonth()) + 2 > 12){
            newenddate = d.getDate() + "-1-" + (parseInt(d.getFullYear()) + 1);
        }else{
            newenddate = d.getDate() + "-" + (parseInt(d.getMonth()) + 2) + "-" + d.getFullYear();
        }

        // kalo belum terdaftar, insert
        await db.query(`INSERT INTO members VALUES(null, '${req.user.id_user}', '-', '${newenddate}', '${since}', '-')`);
        // Update tipe member
        await db.query(`UPDATE users SET type = 2 WHERE id_user='${req.user.id_user}'`);

        return res.status(200).json({
            'Nama User': req.user.nama,
            'Status': 'Berhasil subscribe sebagai member!',
            'Subscription Date': since,
            'End Date': newenddate
        });
    }

    if(req.user.type != 1){
        return res.status(400).json({
            'error msg': 'Anda masih menjadi subscriber!'
        });
    }

    // kalo sudah terdaftar update
    // harus bayar baru bisa menjadi member
    let sisa = (parseInt(req.user.wallet) - cost);
    if(sisa < 0){
        return res.status(400).json({
            'Nama User': req.user.nama,
            'Harga': cost,
            'Wallet': req.user.wallet,
            'Status': 'Wallet tidak mencukupi!'
        });
    }

    if(parseInt(d.getMonth()) + 2 > 12){
        newenddate = d.getDate() + "-1-" + (parseInt(d.getFullYear()) + 1);
    }else{
        newenddate = d.getDate() + "-" + (parseInt(d.getMonth()) + 2) + "-" + d.getFullYear();
    }

    // update member
    await db.query(`UPDATE members SET last_payment = '${since}', end_date = '${newenddate}', member_since = '${since}', unsubscribe = '-' WHERE id_user='${req.user.id_user}'`);
    // Update tipe member
    await db.query(`UPDATE users SET wallet = ${sisa}, type = 2 WHERE id_user='${req.user.id_user}'`);
    // insert ke history payment
    resu = await db.query(`SELECT * FROM members WHERE id_user = '${req.user.id_user}'`);
    await db.query(`INSERT INTO payments VALUES(null, '${resu[0].id_member}', '${since}', ${cost}, 'Bayar Subcribe member menjadi Membership Kembali')`);

    return res.status(200).json({
        'Nama User': req.user.nama,
        'Status': 'Berhasil subscribe kembali sebagai member',
        'Subscription Date': since,
        'End Date': newenddate,
        'Wallet': sisa
    });
})

router.delete('/membership', [cekJWT, authSubscriber], async (req,res)=> {
    let resu = await db.query(`SELECT * FROM members WHERE id_user='${req.user.id_user}'`);

    let tgl = resu[0].last_payment.split("-");
    let lastpayment = new Date(parseInt(tgl[2]), parseInt(tgl[1]) - 1, tgl[0]);
    tgl = resu[0].end_date.split("-");
    let enddate = '-';
    if(parseInt(tgl[1]) - 2 < 0){
        enddate = new Date(parseInt(tgl[2]), 12, tgl[0] - 1);
    }else{
        enddate = new Date(parseInt(tgl[2]), parseInt(tgl[1]) - 2, tgl[0]);
    }

    if(lastpayment.getTime() < enddate.getTime()){
        // belum bayar
        return res.status(402).json({
            'error msg': 'Harap bayar tagihan yang belum lunas untuk unsubscribe!'
        });
    }

    let d = new Date();
    let now = d.getDate() + "-" + (parseInt(d.getMonth()) + 1) + "-" + d.getFullYear();
    await db.query(`UPDATE members SET unsubscribe = '${now}' WHERE id_user='${req.user.id_user}'`);
    await db.query(`UPDATE users SET type = 1 WHERE id_user='${req.user.id_user}'`);
    return res.status(200).json({
        'Nama User': req.user.nama,
        'Status': 'Sukses unsubscribe member',
        'Date unsubscribe': now
    });
});

let cost = 100000;
router.get('/membership/tagihan', [cekJWT, authSubscriber], async (req, res)=>{
    let resu = await db.query(`SELECT * FROM members WHERE id_user='${req.user.id_user}'`);
    if(resu.length == 0){
        return res.status(400).json({
            'error msg': 'Member not found!'
        });
    }

    // cek jika tanggal end date - 1 bulan dibawah tanggal last payments maka hitung tagihan else lunas
    let tgl = resu[0].last_payment.split("-");
    let lastpayment = new Date(parseInt(tgl[2]), parseInt(tgl[1]) - 1, tgl[0]);
    tgl = resu[0].end_date.split("-");
    let enddate = '-';
    if(parseInt(tgl[1]) - 2 < 0){
        enddate = new Date(parseInt(tgl[2]), 12, tgl[0] - 1);
    }else{
        enddate = new Date(parseInt(tgl[2]), parseInt(tgl[1]) - 2, tgl[0]);
    }

    if(lastpayment.getTime() >= enddate.getTime()){
        // sudah bayar
        return res.status(200).json({
            'Nama User': req.user.nama,
            'Pembayaran Terakhir': resu[0].last_payment,
            'End Date': resu[0].end_date,
            'Tagihan Bulan ini': 'Lunas'
        });
    }

    return res.status(200).json({
        'Nama User': req.user.nama,
        'Pembayaran Terakhir': resu[0].last_payment,
        'End Date': resu[0].end_date,
        'Tagihan Bulan ini': cost
    });
});

router.post('/membership/bayar', [cekJWT, authSubscriber], async (req, res)=> {
    let resu = await db.query(`SELECT * FROM members WHERE id_user='${req.user.id_user}'`);

    // cek jika tanggal end date - 1 bulan dibawah tanggal last payments maka bayar else lunas
    let tgl = resu[0].last_payment.split("-");
    let lastpayment = new Date(parseInt(tgl[2]), parseInt(tgl[1]) - 1, tgl[0]);
    tgl = resu[0].end_date.split("-");
    let enddate = '-';
    if(parseInt(tgl[1]) - 2 < 0){
        enddate = new Date(parseInt(tgl[2]), 12, tgl[0] - 1);
    }else{
        enddate = new Date(parseInt(tgl[2]), parseInt(tgl[1]) - 2, tgl[0]);
    }

    if(lastpayment.getTime() >= enddate.getTime()){
        // sudah bayar
        return res.status(200).json({
            'Nama User': req.user.nama,
            'Pembayaran Terakhir': resu[0].last_payment,
            'End Date': resu[0].end_date,
            'Tagihan Bulan ini': 'Telah Lunas'
        });
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
    await db.query(`UPDATE users SET wallet = ${sisa} WHERE id_user='${req.user.id_user}'`);

    // update last payment
    let now = d.getDate() + "-" + (parseInt(d.getMonth()) + 1) + "-" + d.getFullYear();
    await db.query(`UPDATE members SET last_payment = '${now}' WHERE id_user='${req.user.id_user}'`);

    // insert ke history payment
    resu = await db.query(`SELECT * FROM members WHERE id_user = '${req.user.id_user}'`);
    await db.query(`INSERT INTO payments VALUES(null, '${resu[0].id_member}', '${now}', ${cost}, 'Bayar Tagihan Bulanan')`);

    return res.status(200).json({
        'Nama User': req.user.nama,
        'Tanggal Pembayaran': now,
        'Wallet': sisa,
        'Status': 'Berhasil membayar tagihan bulan ini'
    });
});

router.post('/membership/extend', [cekJWT, authSubscriber, cekTagihanBulanLalu], async (req, res) =>{
    // extend end date
    let d = new Date();
    // new end date = 1 bulan dari hari dia extend
    let newenddate = '-';
    if(parseInt(d.getMonth()) + 2 > 12){
        newenddate = d.getDate() + "-1-" + (parseInt(d.getFullYear()) + 1);
    }else{
        newenddate = d.getDate() + "-" + (parseInt(d.getMonth()) + 2) + "-" + d.getFullYear();
    }

    await db.query(`UPDATE members SET end_date = '${newenddate}' WHERE id_user='${req.user.id_user}'`);
    return res.status(200).json({
        'Nama User': req.user.nama,
        'End date': newenddate,
        'Status': 'Berhasil Extend End date subscription!'
    });
});

router.get('/membership/history', [cekJWT, authSubscriber], async (req,res)=>{
    let resu = await db.query(`SELECT * FROM members WHERE id_user = '${req.user.id_user}'`);
    let history =  await db.query(`SELECT * FROM payments WHERE id_member='${resu[0].id_member}'`);

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
});

router.get("/matches/:nama_team_1/:nama_team_2", [cekJWT, authSubscriber, cekMembershipExpired], async(req, res) => {
    let resu1 = await db.query(`SELECT * FROM team WHERE UPPER(nama) = UPPER('${req.params.nama_team_1}')`);
    let resu2 = await db.query(`SELECT * FROM team WHERE UPPER(nama) = UPPER('${req.params.nama_team_2}')`);
    if(resu1.length == 0){
        return res.status(404).json({
            'err msg': 'nama_team_1 not found!'
        });
    }
    if(resu2.length == 0){
        return res.status(404).json({
            'err msg': 'nama_team_2 not found!'
        });
    }

    let options = {
        method: 'GET',
        url: 'https://soccer-football-info.p.rapidapi.com/teams/versus/',
        params: {x: `${resu1[0].id_team}`, y: `${resu2[0].id_team}`, w: '6m', l: 'en_US'},
        headers: {
            'x-rapidapi-key': '8e4f543e6fmsh137a9d0400df44ap1c3d59jsn090091500313',
            'x-rapidapi-host': 'soccer-football-info.p.rapidapi.com'
        }
    };

    axios.request(options).then(function (response) {
        res.status(200).json(response.data.result);
    }).catch(function (error) {
        res.status(500).json({
            'err Msg': 'Internal Error'
        });
        console.error(error);
    });
});

router.get("/history/:nama_team", [cekJWT, authSubscriber, cekMembershipExpired], async(req, res) => {
    let resu = await db.query(`SELECT * FROM team WHERE UPPER(nama) = UPPER('${req.params.nama_team}')`);
    if(resu.length == 0){
        return res.status(404).json({
            'err msg': 'nama_team not found!'
        });
    }

    let options = {
        method: 'GET',
        url: 'https://soccer-football-info.p.rapidapi.com/teams/history/',
        params: {i: `${resu[0].id_team}`, l: 'en_US', w: '6m'},
        headers: {
            'x-rapidapi-key': '8e4f543e6fmsh137a9d0400df44ap1c3d59jsn090091500313',
            'x-rapidapi-host': 'soccer-football-info.p.rapidapi.com'
        }
    };

    axios.request(options).then(function (response) {
        res.status(200).json(response.data.result);
    }).catch(function (error) {
        res.status(500).json({
            'err Msg': 'Internal Error'
        });
        console.error(error);
    });
});




router.get("/team/viewAll", [cekJWT], async(req, res) => {
    // let id = req.params.id;
    let query = `Select * from team`;
    var result = await db.query(query);

    var arrTeam = [];

    if(result.length==0){
        res.status(404).send({error:"Team Tidak Tersedia"});
    }else{

        for (let i = 0; i < result.length; i++) {

            arrTeam.push(
                nama=result[i].nama
            )

        }


        res.status(200).send(arrTeam);
    }
});

router.get("/team/detail", [cekJWT], async(req, res) => {
    let src = req.query.query;

    if(src){
        let query = `Select * from team where nama like "%${src}%"`;
        var result = await db.query(query);

        var arrTeam = [];

        if(result.length==0){
            res.status(404).send({error:"Team Tidak Tersedia"});
        }else{

            res.status(200).send(result);
        }
    }else{
        let query = `Select * from team`;
        var result = await db.query(query);

        var arrTeam = [];

        if(result.length==0){
            res.status(404).send({error:"Team Tidak Tersedia"});
        }else{

            // for (let i = 0; i < result.length; i++) {

            //     arrTeam.push(
            //         nama=result[i].nama
            //     )

            // }


            res.status(200).send(result);
        }
    }

});

router.post("/favorite/add", [cekJWT, authSubscriber], async(req, res) => {
    let token = req.headers['x-auth-token'];
    try{
        user = jwt.verify(token, process.env.secret); // verify token yang dibuat pas login
        // diverify dari file .env dengan nama variable secret

    }catch(e){
        console.log(e);
    }
    let id_team = req.body.id_team;

    let query = `Select * from team where id_team = "${id_team}"`;
    var result = await db.query(query);

    if(result.length==0){
        // nama tim sudah terpakai
        res.status(500).send({error:"Team tidak tersedia"});
    }else{
        query = `Select * from favorite where id_team = "${id_team}" and username_user = "${user.username}" and status=1`;
        let fav = await db.query(query);
        console.log(user.username);
        if(fav.length==0){

            await db.query(`INSERT INTO favorite VALUES(null,"${user.username}","${id_team}",1)`);
            res.status(201).send({
                status : "Success Add "+result[0].nama+" as Favorite Teams"
            });
        }else{

            res.status(500).send({
                error : "Team Sudah terdaftar di List Tim Favorit"
            });

        }


    }
});

router.put("/favorite/remove/:id", [cekJWT, authSubscriber], async(req, res) => {
    let token = req.headers['x-auth-token'];
    try{
        user = jwt.verify(token, process.env.secret); // verify token yang dibuat pas login
        // diverify dari file .env dengan nama variable secret
        console.log(user.username);
    }catch(e){
        console.log(e);
    }
    let id_team = req.params.id;

    let query = `Select * from team where id_team = "${id_team}"`;
    var result = await db.query(query);

    if(result.length==0){
        // nama tim sudah terpakai
        res.status(500).send({error:"Team tidak tersedia"});
    }else{
        query = `Select * from favorite where id_team = "${id_team}" and username_user = "${user.username}" and status=0`;
        let fav = await db.query(query);
        if(fav.length==0){

            await db.query(`UPDATE favorite set status = 0 where id_team="${id_team}"`);
            res.status(201).send({
                status : "Success Remove "+result[0].nama+" from Favorite Teams"
            });
        }else{

            res.status(500).send({
                error : "Team Sudah tidak terdaftar di List Tim Favorit"
            });

        }


    }
});

router.get("/viewManager/:idTeam", [cekJWT], async(req, res) => {
    var axios = require("axios").default;

    var options = {
        method: 'GET',
        url: 'https://soccer-football-info.p.rapidapi.com/managers/view/',
        params: {i: req.params.idTeam, l: 'en_US'},
        headers: {
            'x-rapidapi-key': '8e4f543e6fmsh137a9d0400df44ap1c3d59jsn090091500313',
            'x-rapidapi-host': 'soccer-football-info.p.rapidapi.com'
        }
    };

    axios.request(options).then(function (response) {
        res.status(200).send(response.data["result"]);
    }).catch(function (error) {
        console.error(error);
    });
});

module.exports = router;
const express=require("express");
const app = express();
const db = require("./connection");
const fs= require("fs");
const multer = require('multer');
const morgan=require('morgan');
const axios = require("axios").default;
const jwt = require('jsonwebtoken');
require('dotenv').config(); // setting up
const accessLogStream  = fs.createWriteStream('./218116716.log', {flags:'a'},);
app.use(express.urlencoded({ extended: true }));

morgan.token('meth',(req,res)=>{
    return `Method: `;
});

morgan.token('stat',(req,res)=>{
   return `; Status: ${res.statusCode};`;
});

morgan.token('msg',(req,res)=>{
    let m = '-';
    if(res.statusCode == 400){
        m = 'Bad Request';
    }else if(res.statusCode == 404){
        m = 'Not Found';
    }else if(res.statusCode == 401){
        m = 'Unauthorized';
    }else if(res.statusCode == 200){
        m = 'Sukses';
    }else if(res.statusCode == 201){
        m = 'Created';
    }
    return `Message: ${m};`;
});

morgan.token('tgl',(req,res)=>{
    let d = new Date();
    return `DateTime: ${d.getDate()}/${(parseInt(d.getMonth()) + 1) + ''}/${d.getFullYear()}`;
});

app.use(morgan(`:meth :method; URL: :url:stat :msg :tgl ResponseTime: :response-time ms`,{stream:accessLogStream}));

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

async function auth(req, res, next) {
    let token = req.headers['x-auth-token'];
    if (!token) {
        return res.status(400).json({ error: 'Input invalid', msg: 'API key tidak ditemukan' });
    } else {
        let user = await executeQuery(`SELECT * FROM USERS WHERE API_KEY = '${token}'`);
        if (user.length == 0) {
            return res.status(401).json({ error: 'Unauthorized', msg: 'API key tidak valid' });
        } else {
            user = user[0];
        }
        res.user = user;
        next();
    }
}

//fungsi middleware
async function cekJWT(req, res, next){
    if(!req.headers['x-auth-token']){
        return res.status(401).json({
            'msg':'Unauthorized'
        });
    }
    let token = req.headers['x-auth-token'];
    let user = null;
    try{
        user = jwt.verify(token, process.env.secret); // verify token yang dibuat pas login
        // diverify dari file .env dengan nama variable secret
    }catch(e){
        console.log(e);
        return res.status(401).json({
            'err': 'invalid token'
        });
    }

    // hasil dalam second
    console.log(new Date().getTime()/1000 - user.iat);
    if(new Date().getTime()/1000 - user.iat > 900){
        return res.status(401).json({
            'err': 'Token expired'
        });
    }

    let resu = await db.query(`SELECT * FROM users WHERE username='${user.username}' AND password='${user.password}'`);

    req.user = resu[0]; // jika suskses maka akan mendapatkan user yang diverfikasi jwt

    if(req.user.username == 'admin'){
        req.user['admin'] = 1;
    }else{
        req.user['admin'] = 0;
    }
    console.log(req.user.admin);
    next();
}

//


// no 1
app.post('/api/users/register', upload.single("foto"), async (req,res)=> {
    // let isUpperLowerNumber = /^(?![A-Z]+$)(?![a-z]+$)(?![0-9]+$)(?![A-Z0-9]+$)(?![a-z0-9]+$)[0-9A-Za-z]+$/.test(req.body.test);
    // let tgl = req.body.tanggal_peminjaman.split("-");
    // await db.query(`INSERT INTO PEMINJAMAN VALUES('${}','${}',STR_TO_DATE('${(tgl[0] + " " + tgl[1] + " " + tgl[2])}','%d %m %Y'),'${}')`);

    try {
        if(req.body.username && req.body.nama_user && req.body.email && req.body.password){
            // cek tidak ada usernmae dan email kembar
            let resu = await db.query(`SELECT * FROM USERS WHERE username='${req.body.username}' OR email='${req.body.email}'`);
            if(resu.length > 0){
                return res.status(400).json({
                    'msg': 'Username/Email sudah pernah digunakan'
                });
            }

            await db.query(`INSERT INTO USERS VALUES('${req.body.username}','${req.body.email}','${req.body.password}','${req.body.nama_user}','${req.file.filename}')`);

            return res.status(201).json({
                'nama_user': req.body.nama_user,
                'email': req.body.email,
                'username': req.body.username,
                'password': req.body.password
            });
        }else{
            return res.status(400).json({
                'msg': 'Inputan belum lengkap'
            });
        }
    } catch (error) {
        console.log(error);
        console.log(req.file);
        if(!req.file){
            let err = {
                "err": "File foto belum dimasukkan!"
            };
            return res.status(400).json(err);
        }
    }

});

// no 2
app.post('/api/users/login', async (req,res)=> {
    // let isnum = /^\d+$/.test(req.body.nominal);
    // if(!isnum) return res.status(400).send("Nominal tidak valid");

    if(req.body.password && req.body.username){

        let resu = await db.query(`SELECT * FROM users WHERE username='${req.body.username}' AND password='${req.body.password}'`);

        if(resu.length == 0){
            return res.status(400).send({
                'msg':'username/password ada yang salah'
            });
        }

        // membuat token dari jwt
        let token = jwt.sign({
                'username':req.body.username,
                'password':req.body.password
            },
            process.env.secret
        );

        return res.status(200).json({
            'username': req.body.username,
            'token': token
        });
    }else{
        return res.status(400).json({
            'msg': 'Inputan belum lengkap'
        });
    }
});

// no 3
app.get('/api/users', async (req,res)=>{
    if(req.query.username){
        let resu = await db.query(`SELECT username, nama FROM users WHERE upper(username) like upper('%${req.query.username}%')`);

        return res.status(200).json(resu);
    }else{
        let resu = await db.query(`SELECT username, nama FROM users`);

        return res.status(200).json(resu);
    }
})

// no 4
app.put('/api/users/update', cekJWT, upload.single("foto"), async (req,res)=> {

    try {
        if(req.body.nama_user && req.body.password){
            await db.query(`UPDATE users SET nama='${req.body.nama_user}', password='${req.body.password}', foto='${req.file.filename}' WHERE username='${req.user.username}'`);

            return res.status(200).json({
                'username': req.user.username,
                'nama_lama': req.user.nama,
                'nama_baru': req.body.nama_user,
                'password_lama': req.user.password,
                'password_baru': req.body.password
            });
        }else{
            return res.status(400).json({
                'msg': 'Inputan belum lengkap'
            });
        }
    } catch (error) {
        console.log(error);
        console.log(req.file);
        if(!req.file){
            let err = {
                "err": "File foto belum dimasukkan!"
            };
            return res.status(400).json(err);
        }
    }
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


app.listen(3000);
console.log('Listening to port 3000');

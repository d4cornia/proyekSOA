const db = require("./connection");
const jwt = require('jsonwebtoken');

async function cekJWT(req, res, next){
    if(!req.headers['x-auth-token']){
        return res.status(401).json({
            'error msg': 'Unauthorized!'
        });
    }
    let token = req.headers['x-auth-token'];
    let user = null;
    try{
        user = jwt.verify(token, process.env.secret);
    }catch(e){
        console.log(e);
        req.headers['x-auth-token'] = null;
        return res.status(401).json({
            'error msg': 'Invalid Token!'
        });
    }

    // batasan waktu
    // hasil dalam second
    // console.log(new Date().getTime()/1000 - user.iat);
    // if(new Date().getTime()/1000 - user.iat > 900){
    //     return res.status(401).json({
    //         'err': 'Token expired'
    //     });
    // }

    let resu = await db.query(`SELECT * FROM users WHERE username='${user.username}' AND password='${user.password}'`);

    req.user = resu[0]; // jika suskses maka akan mendapatkan user yang diverfikasi jwt

    next();
}

async function authSubscriber(req, res, next) {
    if(req.user.type != 2){
        // redirect user untuk subscribe
        return res.status(401).json({
            'error msg': 'Hanya untuk subscriber member!'
        });
    }
    next();
}

async function authAdmin(req, res, next) {
    if(req.user.type != 0){
        // redirect user kelogin
        req.headers['x-auth-token'] = null;
        return res.status(401).json({
            'error msg': 'Hanya untuk Admin!'
        });
    }
    next();
}

async function cekMembershipExpired(req, res, next){
    let resu = await db.query(`SELECT * FROM members WHERE id_user='${req.user.id_user}'`);

    let now = new Date();
    let tgl = resu[0].end_date.split("-");
    let enddate = new Date(parseInt(tgl[2]), parseInt(tgl[1]) - 1, tgl[0]);

    if(now.getTime() > enddate.getTime()){
        //expired
        return res.status(402).json({
            'error msg': 'Membership anda expired, harap extend membership anda!'
        });
    }

    next();
}

async function cekTagihanBulanLalu(req, res, next){
    // sebelum bisa extend cek tagihan bulan lalu sudah dibayar belum
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
        // belum bayar bulan ini
        return res.status(402).json({
            'error msg': 'Harap bayar tagihan yang belum lunas!'
        });
    }

    let now = new Date();
    enddate = new Date(parseInt(tgl[2]), parseInt(tgl[1]) - 1, tgl[0]);

    if(now.getTime() <= enddate.getTime()){
        //belum expired
        return res.status(400).json({
            'error msg': 'Membership anda belum expired!'
        });
    }
    next();
}

async function auth(req, res, next) {
    let token = req.headers['x-auth-token'];
    if (!token) {
        return res.status(400).json({ error: 'Input invalid', msg: 'API key tidak ditemukan' });
    } else {
        let user = await executeQuery(`SELECT * FROM users WHERE api_key = '${token}'`);
        if (user.length == 0) {
            return res.status(401).json({ error: 'Unauthorized', msg: 'API key tidak valid' });
        } else {
            user = user[0];
        }
        res.user = user;
        next();
    }
}

module.exports = {
    'auth': auth,
    'authSubscriber': authSubscriber,
    'authAdmin': authAdmin,
    'cekJWT': cekJWT,
    'cekMembershipExpired': cekMembershipExpired,
    'cekTagihanBulanLalu': cekTagihanBulanLalu
};



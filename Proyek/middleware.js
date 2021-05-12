const db = require("./connection");

async function cekJWT(req, res, next){
    if(!req.headers['x-auth-token']){
        return res.status(401).render('pages/login', {
            message: "",
            errorMessage: "Unauthorized!",
            resultArr: []
        });
    }
    let token = req.headers['x-auth-token'];
    let user = null;
    try{
        user = jwt.verify(token, process.env.secret);
    }catch(e){
        console.log(e);
        req.headers['x-auth-token'] = null;
        return res.status(401).render('pages/login', {
            message: "",
            errorMessage: "Invalid Token!",
            resultArr: []
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
        return res.status(400).render('pages/subscribe', {
            message: "",
            errorMessage: "Khusus Subsciber!",
            resultArr: []
        });
    }
    next();
}

async function authAdmin(req, res, next) {
    if(req.user.type != 0){
        // redirect user kelogin
        req.headers['x-auth-token'] = null;
        return res.status(400).render('pages/login', {
            message: "",
            errorMessage: "Akses hanya admin!",
            resultArr: []
        });
    }
    next();
}

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

async function cekQuota(req, res, next){
    // catat log kapan endpoint ini diakses
    await db.query(`SELECT * FROM access_log WHERE apikey='${req.query.apikey}' AND access_at > '${req.user.pembayaran_terakhir}'`);

    next();
}

module.exports = {
    'auth': auth,
    'authSubscriber': authSubscriber,
    'authAdmin': authAdmin,
    'cekJWT': cekJWT,
    'cekQuota': cekQuota,
};



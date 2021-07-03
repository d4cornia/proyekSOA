//sama lah kek minggu-minggu sebelumnya
var mysql = require("mysql");
var pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "proyeksoa"
});

const q = async (query, param) => {
    return new Promise((resolve, reject) => {
        pool.query(query, param, (err, rows, fields) => {
            if (err) reject(err);
            else resolve(rows);
        })
    })
}

module.exports= {
    'query' : q,
}
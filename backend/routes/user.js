const express = require('express');
const router = express.Router();
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  port: "3306",
  password: "password",
  database: "register"
});

/* GET users listing. */
router.post('/register', async function (req, res, next) {
  try {
    let { nameP, username, email, birth, password } = req.body;

    console.log("username "+username);

    const hashed_password = md5(password.toString())
    const checkUsername = `Select username FROM users WHERE username = ?`;
    con.query(checkUsername, [username], (err, result, fields) => {
        const sql = `Insert Into users (nameP, username, email, birth, password) VALUES (?,?,?,?,?)`
        con.query(
          sql, [nameP, username, email, birth, hashed_password],
        (err, result, fields) =>{
          if(err){
            res.send({ status: 0, data: err });
          }else{
            console.log("registro bien")
            let token = jwt.sign({ data: result }, 'secret')
            res.send({ status: 1, data: result, token : token });
          }

        })

    });


  } catch (error) {
    res.send({ status: 0, error: error });
  }
});

router.get('/users', async function (req, res) {
  try {
    let { username, password } = req.body;
    const sql = `SELECT * FROM users`
    con.query(
      sql, [username, hashed_password],
    function(err, result){
      if(err){
        res.send({ status: 0, data: err });
      }else{
        res.send({ status: 1, data: result});
      }

    })
  } catch (error) {
    res.send({ status: 0, error: error });
  }
});

router.post('/login', async function (req, res, next) {
  try {
    let { username, password } = req.body;

    const hashed_password = md5(password.toString())
    const sql = `SELECT * FROM users WHERE username = ? AND password = ?`
    con.query(
      sql, [username, hashed_password],
    function(err, result, fields){
      if(err){
        res.send({ status: 0, data: err });
      }else{
        let token = jwt.sign({ data: result }, 'secret')
        res.send({ status: 1, data: result, token: token });
      }

    })
  } catch (error) {
    res.send({ status: 0, error: error });
  }
});
module.exports = router;

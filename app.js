var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const db = require('./db');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// 登入 API（將帳號密碼存入資料庫）
app.post('/api/login', (req, res) => {
    const { account, password } = req.body;
    if (!account || !password) {
        return res.status(400).json({ error: '帳號與密碼必填' });
    }
    // 判斷是否為指定帳密，若是則回傳 showAll: true 讓前端跳轉 all.html
    if (account === '123@456.789' && password === '123456789') {
        return res.json({ success: true, showAll: true });
    }
    // 其餘帳號密碼照原本流程
    const sql = 'INSERT INTO users (account, password) VALUES (?, ?)';
    db.run(sql, [account, password], function(err) {
        if (err) {
            return res.status(500).json({ error: '資料庫錯誤' });
        }
        res.json({ success: true, id: this.lastID });
    });
});

// 查詢所有帳號密碼 API
app.get('/api/all-users', (req, res) => {
    db.all('SELECT account, password FROM users', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: '資料庫錯誤' });
        }
        res.json({ success: true, users: rows });
    });
});

module.exports = app;

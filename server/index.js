require('dotenv').config();
const express = require('express');
const app = express();
const massive = require('massive');
const session = require('express-session');
const AC = require('./controllers/authController');

const { SERVER_PORT, DB_STRING, SESSION_SECRET } = process.env;

app.use(express.json());

massive({
    connectionString: DB_STRING,
    ssl: { rejectUnauthorized: false }
}).then(db => {
    console.log('DB connected');
    app.set('db', db);
});

app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));

// auth endpoints
app.post('/auth/register', AC.registerUser);
app.post('/auth/login', AC.loginUser);
app.post('/auth/logout', AC.logoutUser);

app.listen(SERVER_PORT, () => console.log(`Got ${SERVER_PORT} sofas and a bench ain't one`))
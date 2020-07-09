require('dotenv').config();
const express = require('express');
const session = require('express-session');
const massive = require('massive');
const auth = require('./middleware/authMiddleware');
const authCtrl = require('./controllers/authController');
const treasureCtrl = require('./controllers/treasureController');

const app = express();

const {CONNECTION_STRING, SESSION_SECRET} = process.env;

const PORT = 4000;

app.use(express.json());

app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

massive({
    connectionString: CONNECTION_STRING,
    ssl: {rejectUnauthorized: false}
}).then((db) => {
    app.set('db', db);
    console.log('Database connected brother');
}).catch(err => console.log(err));

app.post('/auth/register', authCtrl.register);
app.post('/auth/login', authCtrl.login);
app.get('/auth/logout', authCtrl.logout);
app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure);
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure);
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure);
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure);

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
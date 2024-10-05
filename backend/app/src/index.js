if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/mongo');
const passport = require('passport');
const session = require('express-session');
const flash = require('express-flash');
const socketio = require("socket.io");
const { setSocket } = require('./config/sockets');
const { addData } = require('./init/data.init')


const PORT = process.env.PORT || 5001;
const SOCKET_PORT = process.env.SOCKET_PORT || 3201;



const app = express();
//middleWares
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

//socket.io
const server = require("http").createServer(app);
const io = socketio(server);
setSocket(io);
const { handleClient } = require("./config/sockets");
const cookie = require('express-session/session/cookie');
handleClient(io);

// using socket comunicatin for the chat.
server.listen(SOCKET_PORT, () => {
    console.log(`Socket Server is running on port ${SOCKET_PORT}`);
});

//routes
app.use('/branches', require('./routes/branches.routes'));
app.use('/admin', require('./routes/admin.routes'));
app.use('/users', require('./routes/users.routes'));
app.use('/books', require('./routes/books.routes'));
app.use('/users', require('./routes/users.routes'));
app.use('/orders', require('./routes/orders.routes'));
app.use('/statistics', require('./routes/statistics.routes'));
app.use('/auth', require('./routes/auth.routes'));
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});

console.log('Adding Initial Data to the DB')
addData();
console.log('Done')
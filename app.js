const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
// const sql = require('mssql');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 3000;

// const config = {
//   user: 'library_admin',
//   password: 'Azure123',
//   server: 'library123.database.windows.net', // You can use 'localhost\\instance' to connect to named instance
//   database: 'PSLibrary',

//   options: {
//     encrypt: true // Use this if you're on Windows Azure
//   }
// };

// sql.connect(config).catch(err => debug(err));
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'library' }));

require('./src/config/passport.js')(app);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/fonts', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/fonts')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));

app.set('views', './src/views');
app.set('view engine', 'ejs');

const nav = [
  { link: '/books', title: 'Books' },
  { link: '/authors', title: 'Authors' }
];

const bookRouter = require('./src/routes/bookRoutes')(nav);
const adminRouter = require('./src/routes/adminRoutes')();
const authRouter = require('./src/routes/authRoutes')();

app.use('/books', bookRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);

app.get('/', (req, res) => {
  res.render('index', {
    nav,
    title: 'Library'
  });
});

app.listen(port, () => {
  debug(`listening on port ${chalk.green(port)}`);
});

/* Importing required pakages */
var createError = require('http-errors');
var express = require('express');
var path = require('path');
const config = require('config');
const mysql = require("mysql2/promise");
const Web3 = require('web3');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

/* Importing various endpoint routes */
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

/* Using the imported pakages. */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* Using the imported routes */
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(function(req, res, next) {
/** catch 404 and forward to error handler */
  next(createError(404));
});

app.use(function(err, req, res, next) {
  /** Error handler, set locals, only providing error in development and render the error page */
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

////////////////////////////////
async function main(){
/** Sets up connection to database */
  db = await mysql.createConnection({
    host: config.get('db.host'),
    user: config.get('db.user'),
    password: config.get('db.password'),
    database: config.get('db.database'),
    timezone: config.get('db.timezone'),
    charset: config.get('db.charset')
  });
  console.log("Connected!\n")

  try{

    const web3 = new Web3(new Web3.providers.HttpProvider(config.get('web3.url')))

    var filter = web3.eth.filter('latest')

    filter.watch(async function(error, hash){
      var block = await web3.eth.getBlock(hash);
      if (block && block.transactions) {
        block.transactions.forEach(async (e) => {
          var object =  await web3.eth.getTransaction(e);
          // console.log(object.hash, object.from, object.to);
          db.query(`Insert into transactions values ("${object.hash}", "${object.from}","${object.to}");`);  
        });
      }
    });
    


  }catch(err){
      console.log(err);   
  }

}
main();

module.exports = app;
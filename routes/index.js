var express = require('express');
const config = require('config');
const mysql = require("mysql2/promise");
const Web3 = require('web3');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', { title: 'Express' });
});

router.post('/', async function(req, res, next) {
  const [web3url] = await db.query(`SELECT network_url FROM network where id = ${req.body.networkID};`);
        var web3 = new Web3(web3url[0].network_url);
        
        var myAddr = req.body.WalletAddress;
        var currentBlock = await web3.eth.getBlockNumber();
        console.log(currentBlock);
        var n = await web3.eth.getTransactionCount(myAddr, currentBlock);
        console.log(n);
        var bal = await web3.eth.getBalance(myAddr, currentBlock);
        console.log(bal);
        for (var i=55000 ; i <= 55050 && (n > 0 || bal > 0); i++) {
            try {
                var block = await web3.eth.getBlock(i, true);
                if (block && block.transactions) {
                    block.transactions.forEach((e) => {
                        console.log(e);
                        console.log(i, e.from, e.to, e.value.toString(10));
                    });
                }
            } catch (e) { console.error("Error in block " + i, e); }
        }
  res.render('index', { title: 'Working on stuff' });
});

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
  }
  main();

module.exports = router;

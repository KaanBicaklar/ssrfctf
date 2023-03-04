const express = require('express');
const app = express();
const fs = require('fs');
const puppeteer = require('puppeteer');

app.get('/flag', function (req, res) {
  var ip = req.headers.host;
  if (ip.includes("127.0.0.1")|ip.includes("localhost")|ip.includes("Your_Local_IP")) {
    res.end('Flag{W4s_34sy}');
  } else {
      res.writeHead(403);
      res.end("bu ip adresinden giris yapamazsin:"+ip+"\n bu alana sadece benim ip adresimden gidilebilir.");
  }
});
app.get('/', function (req, res) {
  fs.readFile('index.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();});
});
app.get('/screenshot', function (req, res) {
  var url = req.query.url;
  //require the url to be passed
  if (!url) {
    res.send('No url specified');
  } else {
    //create a new instance of puppeteer
    (async() => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(url);
      const randomNumber = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      await page.screenshot({
        
        path: randomNumber + '.png',
        fullPage: true
      });
      await browser.close();
      //read the screenshot
      fs.readFile(randomNumber + '.png', function (err, data) {
        if (err) throw err;
        //set the content type
        res.writeHead(200, {
          'Content-Type': 'image/png'
        });
        //send the image
        res.end(data);
      });
    })();
  }
});

app.listen(3000);
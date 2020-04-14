var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();
var blogDB = require('./DB.json');

//app modules
var data = require('./data.js');
var view = require('./view.js');

app.use(bodyParser.json());

app.use('/', express.static('public'));

app.post('/post', function (req, res){
  if (req.body && req.body.titleText && req.body.bodyText) {
    console.log("===== NEW POST ADDED =====");
    console.log("  - title:", req.body.titleText);
    console.log("  - body:", req.body.bodyText);
    database.update(blogDB, req.body);

    res.status(200).send("Photo successfully added");
  } else {
    res.status(400).send("Requests to this path must " +
      "contain a JSON body with Title and Body " +
      "fields.");
  }
});


app.get('/blogDB', function(req, res, next) {
  //console.log("Get request received");
  res.json(blogDB);
});

app.listen(80, function() {
  console.log('Server listening on port 80!');
});

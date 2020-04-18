var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();
var blogDB = require('./DB.json');

var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
// app.get('/', function(req, res) {
//   res.send('Hello World!');
// });
app.use(bodyParser.json());


function setPostDate(blogObj) {
  var d = new Date();
  var prettyDate = months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
  blogObj.lastUpdate = prettyDate;
  blogObj.posts[blogObj.posts.length - 1].date = prettyDate;
}


function updateDB(blogObj, newPost) {
  console.log("Running the updateDB funciton");
  //var newObj = JSON.parse(blogObj);
    blogObj.posts.push({title: newPost.titleText, body: newPost.bodyText});
    setPostDate(blogObj);
    blogObj.numberOfPosts = blogObj.posts.length;
    //console.log(blogDB);
    fs.writeFile('DB.json', JSON.stringify(blogObj), function (err) {
      if (err) throw err;
      console.log('Saved!');
      // fs.readFile('DB.json', (err, data) => {
      //     if (err) console.log("No databse");
      //     blogDB = JSON.parse(data);
      // });
    });
}

app.post('/post', function (req, res){
  if (req.body && req.body.titleText && req.body.bodyText) {
    console.log("===== NEW POST =====");
    console.log("  - title:", req.body.titleText);
    console.log("  - body:", req.body.bodyText);
    console.log("  - object:", req.body);
    //console.log(blogDB);
    updateDB(blogDB, req.body);

    res.status(200).send("Photo successfully added");
  } else {
    res.status(400).send("Requests to this path must " +
      "contain a JSON body with Title and Body " +
      "fields.");
  }
});


app.use('/', express.static('public'));

app.get('/blogDB', function(req, res, next){

  //var blogDB = require('./DB.json');
  console.log("Get request received");
  res.json(blogDB);

});

app.listen(80, function() {
  console.log('Server listening on port 80!');
});

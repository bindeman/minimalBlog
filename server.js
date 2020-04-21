var express = require('express');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var blogDB = require('./DB.json');

var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

var app = express();
app.use(bodyParser.json());


// var blog = {
//   siteTitle: "The Good Blog",
//   subtitle : "The Center for all your blog needs",
//   //lastUpdate: "No Recent Update",
//
//   numberOfPosts : function() {
//     return this.posts.length + " posts";
//   },
//
//   lastUpdate : function() {
//
//     return "Last Update: " + this.posts[this.posts.length - 1].date;
//   },
//   posts: [{title: "Drive",
//            body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
//            date: "Febraury 12, 2019",
//            id: 0
//             },
//           {title: "Deez Penuts",
//            body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
//            date: "November 1, 2019",
//            id: 1
//          },
//           {title: "Coronavirus helps with weight Loss, experts say",
//            body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
//            date: "Febraury 12, 2018",
//            id: 2
//          },
//          {title: "The world needs more leaders",
//           body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
//           date: "March 22, 2017",
//           id: 3
//         },
//         {title: "What is Love",
//          body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
//          date: "December 4, 2016",
//          id: 4
//           }
//          ]
// };

function setPostDate(blogObj) {
  var d = new Date();
  var prettyDate = months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
  blogObj.lastUpdate = prettyDate;
  blogObj.posts[blogObj.posts.length - 1].date = prettyDate;
  blogObj.posts[blogObj.posts.length - 1].id = blogObj.posts.length - 1;

}


function updateDB(blogObj, newPost) {
  console.log("Running the updateDB function");
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
    updateDB(blogDB, req.body);

    res.status(200).send("Photo successfully added");
  } else {
    res.status(400).send("Requests to this path must " +
      "contain a JSON body with Title and Body " +
      "fields.");
  }
});

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.set('port', (process.env.PORT || 80));
app.use(express.static('public'));

app.get('/', function(req, res) {
    res.render('home', {

      content: 'This is some content',
      siteTitle: blogDB.siteTitle,
      posts: blogDB.posts,
      //lastUpdate: date,
      //numberOfPosts: postCount,
      // lastUpdate: blog.lastUpdate(),
      helpers: {
            numberOfPosts: function () {
              return blogDB.numberOfPosts + " posts";
            },
            lastUpdate: function () {
              return "Updated: " + blogDB.lastUpdate;
            }


      }
      // numberOfPosts: numberOfPosts()
    });
});

app.get('/:postId', function (req, res, next) {
  var postId = parseInt(req.params.postId);
  // console.log(req.params.postId);
  // console.log("You requested post number " + postId);
  // console.log(blog.posts[postId].title);
  // console.log(blog.posts[postId].date);
  // console.log(blog.posts[postId].body);
  if (blogDB.posts[postId]) {
    // res.status(200).sendFile(
    //   __dirname + '/public/people/' + person + '.html'
    // );
    // console.log("== peopleData[person]:", peopleData[person])
    var relatedPostsArr = [];
    // function update() {
      if(blogDB.posts[postId-1]) relatedPostsArr.push(Object.assign({}, blogDB.posts[postId-1]));
      if(blogDB.posts[postId-2]) relatedPostsArr.push(Object.assign({}, blogDB.posts[postId-2]));
      if(blogDB.posts[postId+1] && relatedPostsArr.length === 0) relatedPostsArr.push(Object.assign({}, blogDB.posts[postId+1]));
      if(blogDB.posts[postId+2] && relatedPostsArr.length === 1) relatedPostsArr.push(Object.assign({}, blogDB.posts[postId+2]));

      //console.log(relatedPosts);
      relatedPostsArr.forEach(relateditem => relateditem.body = relateditem.body.slice(0, 150));
    // }
    res.render('single', {
      title: blogDB.posts[postId].title,
      date: blogDB.posts[postId].date,
      body: blogDB.posts[postId].body,
      siteTitle: blogDB.siteTitle,
      relatedPosts: relatedPostsArr
      // helpers: {
      //       relatedPosts: function () {
      //         //var relatedPostsArr;
      //
      //             //relatedPostsArr.push(blog.posts[1]);
      //             //relatedPostsArr.push(blog.posts[2]);
      //             console.log("we're in here");
      //         return blog.posts[2].title;
      //       }
      // }
    });
  } else {
    next();
  }
});


app.listen(app.get('port'), function (){
  console.log('Server running on port ' + app.get('port'));

});

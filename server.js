var express = require('express');
var path = require('path');
var exphbs = require('express-handlebars');

var app = express();

var people = ['John', 'Sara', 'Paul'];

var blog = {
  siteTitle: "The Good Blog",
  subtitle : "The Center for all your blog needs",
  //lastUpdate: "No Recent Update",

  numberOfPosts : function() {
    return this.posts.length + " posts";
  },

  lastUpdate : function() {

    return "Last Update: " + this.posts[this.posts.length - 1].date;
  },
  posts: [{title: "Drive",
           body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
           date: "Febraury 12, 2019",
           id: 0
            },
          {title: "Deez Penuts",
           body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
           date: "November 1, 2019",
           id: 1
         },
          {title: "Coronavirus helps with weight Loss, experts say",
           body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
           date: "Febraury 12, 2018",
           id: 2
         },
         {title: "The world needs more leaders",
          body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          date: "March 22, 2017",
          id: 3
        },
        {title: "What is Love",
         body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
         date: "December 4, 2016",
         id: 4
          }
         ]
};



app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.set('port', (process.env.PORT || 3000));
app.use(express.static('public'));

app.get('/', function(req, res) {
    res.render('home', {

      content: 'This is some content',
      people: people,
      siteTitle: blog.siteTitle,
      posts: blog.posts,
      //lastUpdate: date,
      //numberOfPosts: postCount,
      // lastUpdate: blog.lastUpdate(),
      helpers: {
            numberOfPosts: function () {
              return blog.numberOfPosts();
            },
            lastUpdate: function () {
              return blog.lastUpdate();
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
  if (blog.posts[postId]) {
    // res.status(200).sendFile(
    //   __dirname + '/public/people/' + person + '.html'
    // );
    // console.log("== peopleData[person]:", peopleData[person])
    var relatedPostsArr = [];
    // function update() {
      if(blog.posts[postId-1]) relatedPostsArr.push(blog.posts[postId-1]);
      if(blog.posts[postId-2]) relatedPostsArr.push(blog.posts[postId-2]);

      //console.log(relatedPosts);
      relatedPostsArr.forEach(relateditem => relateditem.body = relateditem.body.slice(0, 150));
    // }
    res.render('single', {
      title: blog.posts[postId].title,
      date: blog.posts[postId].date,
      body: blog.posts[postId].body,
      siteTitle: blog.siteTitle,
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

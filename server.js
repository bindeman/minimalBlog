var express = require('express');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var blogDB = require('./DB.json');
var postsDB = require('./postsDB.json');

var app = express();
app.use(bodyParser.json());


app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.set('port', (process.env.PORT || 80));
app.use(express.static('public'));



class Post {
  constructor(title, body) {
    this.title = title;
    this.body = body;
    this.id = Date.now();
    this.date = Post.setPrettyDate();
    this.url = Post.setPostURL(title);
}

  static setPostURL(title) {
    return title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
  }
  static setPrettyDate() {
    var d = new Date();
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    return months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
  }

}

class Posts {
  constructor(title, jsonFile) {
    this.category = title;
    this.posts = jsonFile;
    this.count = this.posts.length;
    this.latestPost = this.posts[this.count-1];
    this.lastUpdate = this.latestPost.date;
    this.views = 0;
    this.likes = 0;

  }

  // setPostsObj(jsonFile) {
  //   if(jsonFile) return jsonFile //see if I can just access the file directly
  //   else {
  //     let arr = [];
  //     return arr;
  //   }
  // }

  addPost(Post) {
      this.writeToDB();
      this.lastUpdate  = Post.date;
      this.posts.push(Post);
      this.count--;
      this.latestPost = Post;
  }

  writeToDB() {
    fs.writeFile('postsDB.json', JSON.stringify(this.posts), function (err) {
      if (err) throw err;
      console.log('Updated database!');
      // fs.readFile('DB.json', (err, data) => {
      //     if (err) console.log("No databse");
      //     blogDB = JSON.parse(data);
      // });
    });

  }

  removePost(id) {
    let itemIndex = null;
    itemIndex = this.post.forEach((item, index) => {
        if(item.id == id) {
            //itemIndex = index;

            return index; // break out of loop for efficiency
        }
    });

    if(itemIndex !== null) {
      if(this.posts[itemIndex] == this.latestPost) {
            if(itemIndex == 0) {
              this.latestPost = null;
              this.lastUpdate = null;
            }
            else {
              this.latestPost = this.posts[itemIndex-1];
              this.lastUpdate = this.date;
            }
          }
        this.posts.splice(itemIndex, 1);
        this.writeToDB();
        this.count--;

        return true;
    }
    return false;
  }


}

var posts = new Posts("category", postsDB);


app.post('/post', function (req, res){
  if (req.body && req.body.titleText && req.body.bodyText) {
    console.log("===== NEW POST =====");
    console.log("  - title:", req.body.titleText);
    console.log("  - body:", req.body.bodyText);
    console.log("  - object:", req.body);
    var newPost = new Post(req.body.titleText, req.body.bodyText);
    posts.addPost(newPost);

    res.status(200).send("Photo successfully added");
  } else {
    res.status(400).send("Requests to this path must " +
      "contain a JSON body with Title and Body " +
      "fields.");
  }
});



app.get('/', function(req, res) {
    res.render('home', {
      siteTitle: blogDB.siteTitle,
      posts: posts.posts,
      //lastUpdate: date,
      //numberOfPosts: postCount,
      // lastUpdate: blog.lastUpdate(),
      helpers: {
            numberOfPosts: function () {
              return posts.count + " posts";
            },
            lastUpdate: function () {
              return "Updated: " + posts.lastUpdate;
            }
      }

    });
});

app.get('/:postId', function (req, res, next) {
  var postId = parseInt(req.params.postId);
  // console.log(req.params.postId);
  // console.log("You requested post number " + postId);
  // console.log(blog.posts[postId].title);
  // console.log(blog.posts[postId].date);
  // console.log(blog.posts[postId].body);
  if (posts.posts[postId]) {
    // res.status(200).sendFile(
    //   __dirname + '/public/people/' + person + '.html'
    // );
    // console.log("== peopleData[person]:", peopleData[person])
    var relatedPostsArr = [];
    // function update() {
      if(posts.posts[postId-1]) relatedPostsArr.push(Object.assign({}, blogDB.posts[postId-1]));
      if(posts.posts[postId-2]) relatedPostsArr.push(Object.assign({}, blogDB.posts[postId-2]));
      if(posts.posts[postId+1] && relatedPostsArr.length === 0) relatedPostsArr.push(Object.assign({}, blogDB.posts[postId+1]));
      if(posts.posts[postId+2] && relatedPostsArr.length === 1) relatedPostsArr.push(Object.assign({}, blogDB.posts[postId+2]));

      //console.log(relatedPosts);
      relatedPostsArr.forEach(relateditem => relateditem.body = relateditem.body.slice(0, 150));
    // }
    res.render('single', {
      title: posts.posts[postId].title,
      date: posts.posts[postId].date,
      body: posts.posts[postId].body,
      siteTitle: blogDB.siteTitle,
      relatedPosts: relatedPostsArr
    });
  } else {
    next();
  }
});


app.listen(app.get('port'), function (){
  console.log('Server running on port ' + app.get('port'));

});

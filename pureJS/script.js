


var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

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
           date: "Febraury 12, 2019"
            },
          {title: "Deez Penuts",
           body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
           date: "November 1, 2019"
         },
          {title: "Coronavirus helps with weight Loss, experts say",
           body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
           date: "Febraury 12, 2018"
            }
         ]
};


function setPostDate() {
  var d = new Date();
  blog.posts[blog.posts.length - 1].date = d.getDate() + " " + months[d.getMonth()] + ", " + d.getFullYear();
}

//var print = fullName
document.getElementById("site-title").innerHTML = blog.siteTitle;
function updateBlogStats() {
document.getElementById("numberOfPosts").innerHTML = blog.numberOfPosts();
document.getElementById("lastUpdate").innerHTML = blog.lastUpdate();
}
//document.getElementsByClassName("site-title").innerHTML = "hey";
updateBlogStats();

var postsReference = blog.posts;
//List All the Posts
postsReference.forEach(printPosts);

function printPosts(item, index, array) {
var postDiv = document.createElement('div');
postDiv.classList.add('post');
 var postTitle = document.createElement('h2');
var postBody = document.createElement('p');

var postTitleText =
    document.createTextNode(blog.posts[index].title);
postTitle.appendChild(postTitleText);
  var postBodyText =
    document.createTextNode(blog.posts[index].body);
postBody.appendChild(postBodyText);

postDiv.appendChild(postTitle);
postDiv.appendChild(postBody);
var parentElement = document.getElementById('post-content');
parentElement.prepend(
    postDiv,
    parentElement.firstChild
);
}

var newPostButton = document.getElementById("new-post");

// newPostButton.onclick = function() {
//   var composer = document.getElementById('modal-background');
//   if(composer.style.display === "none") {
//     composer.style.display = "block"
//     //composer.classList.add('transition_from_top');
//     document.getElementById('new-post').innerHTML = "Cancel";
//   } else {
//     composer.style.display = "none";
//     document.getElementById('new-post').innerHTML = "New Post";
//   }
//
// }

newPostButton.onclick = function() {
  var navbar = document.getElementById('navbar');
  var newPostModal = document.getElementById('new-post-modal');
  if(navbar.style.height === "65px") {
    newPostModal.style.display = "block";
    //newPostModal.classList.add('fadeOut');
    navbar.style.height = "100%";
    navbar.style.opacity = "0.90";
    //alert("It's equal to 65");
    //composer.classList.add('transition_from_top');
    document.getElementById('new-post').innerHTML = "Done";


  } else {
    //alert("It's not equal to 65");
    newPostModal.style.display = "none";
    navbar.style.height = "65px";
    navbar.style.opacity = "1.0";
    document.getElementById('new-post').innerHTML = "New Post";
  }

}

// function newPost() {
//  var titleText = document.getElementById('title-input').value;
//  var bodyText = document.getElementById('body-input').value;
//  blog.updated = "Hey";
//  blog.posts.push({title: titleText, body: bodyText});
//
// }

var submitPostButton = document.getElementById("submit-post");
var errorArea = document.getElementById("error-area");
var errorText = document.getElementById('error-message');
var loadingSpinner = document.getElementById('loaderSpinner')

submitPostButton.onclick = function () {
  loadingSpinner.style.display = "inline-block";
  setTimeout(submitPost, 500);

}






function submitPost() {
 var titleText = document.getElementById('title-input');
 var bodyText = document.getElementById('body-input');
 if (bodyText.value.length === 0 || titleText.value.length === 0 ) {
    errorArea.classList.add('error-area');
    loadingSpinner.style.display = "none";
    errorText.style.opacity = "1.0";
 } else {
   //submitPostButton.value = "Posting";
   errorArea.classList.remove('error-area');
   errorText.style.opacity = "0.0";
  loadingSpinner.style.display = "none";
  //newPostModal.classList.add("fadeOut");
  blog.posts.push({title: titleText.value, body: bodyText.value});
   bodyText.value = "";
   titleText.value = "";

  var contentDiv = document.getElementById("post-content");
  while(contentDiv.firstChild) {
                contentDiv.removeChild(contentDiv.firstChild);
            }
  postsReference.forEach(printPosts);
  setPostDate();
  updateBlogStats();
 }






 //alert("Submitting post...");
}

// function has_scrollbar(title-input)
// {
//     const elem = document.getElementById(elem_id);
//     if (elem.clientHeight < elem.scrollHeight)
//         alert("The element has a vertical scrollbar!");
//     else
//         alert("The element doesn't have a vertical scrollbar.");
// }

//x.appendChild(postTitle);
//}

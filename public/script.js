var blog;
var postsReference;


var titleText = document.getElementById('title-input');
var bodyText = document.getElementById('body-input');
var serverTimeout;



function blogRefresh() {
  var xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          blog = JSON.parse(this.responseText);

          console.log(blog);
          refreshPosts(blog.posts);
          updateBlogStats();
      } else {
        //alert("Cannot reach server");
      }
  };
  xmlhttp.open("GET", "blogDB", true);
  xmlhttp.send();


}


//new post

function storePhotoInDB(title, body) {
  var request = new XMLHttpRequest();
  request.open('POST', "/post");

  var newPost = {
    titleText: title,
    bodyText: body
  };


  var requestBody = JSON.stringify(newPost);

  request.setRequestHeader(
    'Content-Type', 'application/json'
  );

  request.send(requestBody);

  request.addEventListener('load', function (storePhotoInDB) {
  clearTimeout(serverTimeout);
  loadingSpinner.style.display = "none";
  if (event.target.status !== 200) {
    var message = event.target.response;
    triggerError(500);
    alert("Error storing post in database: " + message);
  } else {
    blog.posts.push({title: titleText.value, body: bodyText.value});
     bodyText.value = "";
     titleText.value = "";

    //document.getElementById("post-content").innerHTML = " ";
    var contentDiv = document.getElementById("post-content");
    while(contentDiv.firstChild) {
                  contentDiv.removeChild(contentDiv.firstChild);
              }
    blogRefresh();
    //postsReference.forEach(printPosts);
    //setPostDate();
    //updateBlogStats();


  }
});
}


// function deletePost(id) {
//   var request = new XMLHttpRequest();
//   request.open('POST', "/delete/" + id);
//
//
//   var requestBody = JSON.stringify(newPost);
//
//   request.setRequestHeader(
//     'Content-Type', 'application/x-www-form-urlencoded'
//   );
//
//   request.send(requestBody);
//
//   request.addEventListener('load', function (storePhotoInDB) {
//   clearTimeout(serverTimeout);
//   loadingSpinner.style.display = "none";
//   if (event.target.status !== 200) {
//     var message = event.target.response;
//     triggerError(500);
//     alert("Error storing post in database: " + message);
//   } else {
//     blog.posts.push({title: titleText.value, body: bodyText.value});
//      bodyText.value = "";
//      titleText.value = "";
//
//     //document.getElementById("post-content").innerHTML = " ";
//     var contentDiv = document.getElementById("post-content");
//     while(contentDiv.firstChild) {
//                   contentDiv.removeChild(contentDiv.firstChild);
//               }
//     blogRefresh();
//     //postsReference.forEach(printPosts);
//     //setPostDate();
//     //updateBlogStats();
//
//
//   }
// });
// }

function setPostDate() {
  var d = new Date();
  blog.posts[blog.posts.length - 1].date = d.getDate() + " " + months[d.getMonth()] + ", " + d.getFullYear();
}



function updateBlogStats() {
document.getElementById("site-title").innerHTML = blog.siteTitle;
document.getElementById("numberOfPosts").innerHTML = blog.numberOfPosts + " posts";
document.getElementById("lastUpdate").innerHTML = blog.lastUpdate;
}
//document.getElementsByClassName("site-title").innerHTML = "hey";
//updateBlogStats();


//List All the Posts
//postsReference.forEach(printPosts);
function refreshPosts(postsReference) {
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
  var newPostButton = document.getElementById('new-post');
  var navbar = document.getElementById('navbar');
  var newPostModal = document.getElementById('new-post-modal');
  if(newPostButton.innerHTML === "New Post") {
    newPostModal.style.display = "block";
    //newPostModal.classList.add('fadeOut');
    navbar.style.height = "100%";
    navbar.style.opacity = "0.90";
    //alert("It's equal to 65");
    //composer.classList.add('transition_from_top');
    newPostButton.innerHTML = "Done";


  } else {
    //alert("It's not equal to 65");
    newPostModal.style.display = "none";
    navbar.style.height = "65px";
    navbar.style.opacity = "1.0";
    newPostButton.innerHTML = "New Post";
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
  setTimeout(submitPost, 250);
  //submitPost();
}


function triggerError(error) {
    errorArea.classList.add('error-area');
    loadingSpinner.style.display = "none";
    errorText.style.opacity = "1.0";
    var errorValue = "An unknwon error occured.";

  switch(error) {
  case 500:
    errorValue = "Internal server error.";
    break;
  case 503:
    errorValue = "Server not responding to request. Please try again later.";
    break;
  case 100:
    errorValue = "You must enter text in both fields to post.";
    break;
  default:
    // set to default error value
}
    errorText.innerHTML = errorValue;


}



function submitPost() {

 if (bodyText.value.length === 0 || titleText.value.length === 0 ) {
   triggerError(100);
 } else {
   //submitPostButton.value = "Posting";
   errorArea.classList.remove('error-area');
   errorText.style.opacity = "0.0";

  //newPostModal.classList.add("fadeOut");
  serverTimeout = setTimeout(triggerError, 2000, 503);
  storePhotoInDB(titleText.value, bodyText.value);

  }
}

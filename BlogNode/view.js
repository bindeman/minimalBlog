var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

function setPostDate(blogObj) {
  var d = new Date();
  var prettyDate = months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
  blogObj.lastUpdate = prettyDate;
  blogObj.posts[blogObj.posts.length - 1].date = prettyDate;
}

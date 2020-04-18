function update(blogObj, newPost) {
  console.log("Running the updateDB funciton");
    blogObj.posts.push({title: newPost.titleText, body: newPost.bodyText});
    view.setPostDate(blogObj);
    blogObj.numberOfPosts = blogObj.posts.length;
    //console.log(blogDB);
    fs.writeFile('DB.json', JSON.stringify(blogObj), function (err) {
      if (err) throw err;
      console.log('Saved!');
    });
}

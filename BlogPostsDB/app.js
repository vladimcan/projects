
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const startContent= 'Welcome to Daily Journal!\<br\/\>You can treat it as a personal blog or a diary. Here you can save your thoughts or describe your experiences.\<br\/\>Unfortunately, though, user management is not implemented yet, and all posts are public... so just feel free to share what\'s on your mind for the world to see.\<br\/\>\<br\/\>Please click "Compose Post" and submit a new entry. The information will be stored on the server side and displayed back on this page.';
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";


// run Server
const app = express();

// add EJS
app.set('view engine', 'ejs');

// add Parser, public files
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

main().catch(err => console.log(err));

async function main() {

 await mongoose.connect('mongodb+srv://username:password@cluster0.5j6gu.mongodb.net/blogpostsDB',{useNewUrlParser: true, useUnifiedTopology: true});
  const postsSchema = new mongoose.Schema({
    dateOfPost:Date,
    title: String,
    content: String
});

const Post = mongoose.model('Post', postsSchema);

  // wait Get request fron Client's Browser
  app.get("/", async function(req,res){
    const posts = await Post.find({});
    res.render("home",{startingContent:startContent, renderedPosts:posts});
  });


  // wait Get request /about from Client's Browser
  app.get("/about",function(req,res){
    res.render("about",{aboutContent:aboutContent});
  });

  // wait Get request /contact from Client's Browser
  app.get("/contact",function(req,res){
    res.render("contact",{contactContent:contactContent});
  });

  // wait Get request /compose from Client's Browser
  app.get("/compose",function(req,res){
    res.render("compose");
  });
  //process POST request from <form> on the compose.html
  app.post("/compose", async function(req,res){
    const currentDate = new Date(); 
    const post = new Post({
      dateOfPost:currentDate,
      title: req.body.postTitle,
      content: req.body.postBody
    });
    await post.save();
    res.redirect("/");
  });

  // process link from home.html to show full post
  app.get("/posts/:postId", async function(req, res){
    const requestedId = req.params.postId;
    const post = await Post.findOne({_id: requestedId});
    const postedDate = post.dateOfPost.toString().substring(0,21);
        res.render("post",{title:post.title, date:postedDate, content:post.content});

  });

  let port = process.env.PORT;
  if (port == null || port == "") {
    port = 3000;
  }
  
  app.listen(port, function(){
    console.log("Server has started.");
  });
} // end main()

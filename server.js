
/**
 * Module dependencies.
 */

var express = require('express'),
    mongoose = require('mongoose');

var db = mongoose.createConnection('localhost', 'blog');
var schema = mongoose.Schema(
    {title : String, text : String}
  );

var postmodel = db.model('posts', schema);

console.log("We are connected");

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {
    layout: false
  });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});


app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
var routes = {
  index: function(req, res){
    res.render('index');
  },

  partials : function (req, res) {
    var name = req.params.name;
    res.render('partials/' + name);
  },

  posts : function (req, res) {
    var posts = [];
    postmodel.find(function(err, dbposts) {
      dbposts.forEach(function (post, i) {
        posts.push({
          id: post.id,
          title: post.title,
          text: post.text.substr(0, 50) + '...'
        });
      });
      res.json({
        posts: posts
      });
    });
  },

  post : function (req, res) {
    var id = req.params.id;
    postmodel.findById(id, function(err, rec) { 
      if (!err) {
        res.json({
          post: rec
        });
      } else {
        res.json(false);
      }
    });
  },

  addPost : function (req, res) {
    var newPost = new postmodel(req.body);
    newPost.save();

    res.json(req.body);
  },

  editPost : function (req, res) {
    var id = req.params.id;
    postmodel.findById(id, function(err, rec) {
      if (!err) {
        rec.title = req.body.title;
        rec.text = req.body.text;
        rec.save();

        res.json(req.body);
      } else {
        res.json(false);
      }
    });
  },

  deletePost : function (req, res) {
    var id = req.params.id;

    postmodel.findById(id, function(err, rec) {
      if (!err) {
        rec.remove();

        exports.posts(req, res);
      } else {
        res.json(false);
      }
    });
  }

};

app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// JSON API

app.get('/api/posts', routes.posts);

app.get('/api/post/:id', routes.post);
app.post('/api/post', routes.addPost);
app.put('/api/post/:id', routes.editPost);
app.delete('/api/post/:id', routes.deletePost);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Start server

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

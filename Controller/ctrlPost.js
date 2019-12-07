const Post = require('../Model/mdlPost')

exports.createPost = function(req, res) {
    res.render("post", {errors: []})
}

exports.newPost = function(req, res) {
    let pst = new Post(req.body, req.session.user._id)
    pst.createPost().then(function(p) {
        res.redirect('/')
    }).catch(function(p) {
        req.flash('errors', pst.errors)
        res.render('post', {errors: req.flash('errors')})
    })
}
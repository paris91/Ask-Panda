const Post = require('../Model/mdlPost')
const ObjectID = require('mongodb').ObjectID

exports.createPost = function(req, res) {
    res.render("post", {errors: [], isEdit: false, post: {}})
}

exports.newPost = function(req, res) {
    let pst = new Post(req.body, req.currentUser)
    pst.createPost().then(function(id) {
        req.flash('success', "Post created successfully.")
        res.redirect(`/post/${id}`)
    }).catch(function(p) {
        req.flash('errors', pst.errors)
        res.render('post', {errors: req.flash('errors'), isEdit: false, post: {}})
    })
}

exports.viewPost = async function(req, res) {
    try {        
        let pst = await Post.findPostByID(req.params.id, req.currentUser)
        res.render('viewpost', {success: req.flash('success'), post: pst})
    } catch {
        res.render('404')
    }
}

exports.editPost = async function(req, res) {
    try {
        let pst = await Post.findPostByID(req.params.id, req.currentUser)
        if (pst.isAuthor) {
            res.render('post', {errors: [], isEdit: true, post: pst})            
        } else {
            res.render('404')
        }        
    } catch {
        res.render('404')
    }
}

exports.deletePost = async function(req, res) {
    try {
        let pst = await Post.findPostByID(req.params.id, req.currentUser)
        if(pst.isAuthor) {
            Post.removePost(req.params.id).then(() => {
                res.redirect(`/profile/${req.session.user.uname}`)
            }).catch(function() {
                res.render('404')
            })
        } else {
            res.render('404')
        }        
    } catch {
        res.render('404')
    }

}

exports.updatePost = async function(req, res) {
    let pst = new Post(req.body, req.currentUser)
    pst._id = req.params.id
    pst.updatePost().then(() => {
        res.redirect('/')
    }).catch(function() {
        req.flash('errors', pst.errors)
        res.render('post', {errors: req.flash('errors'), isEdit: true, post: pst})
    })

}

exports.searchPosts = function(req, res) {
    Post.searchPosts(req.body.searchText).then((response) => {
        res.send(response)
    }).catch(function() {
        res.send([])
    })
}

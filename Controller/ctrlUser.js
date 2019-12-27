const User = require('../Model/mdlUser')
const Post = require('../Model/mdlPost')

exports.home = function(req, res) {
    if (req.session.user) {
        res.render("feed")
    }
    else {
        res.render("home", {errors: req.flash('errors')})
    }
}

exports.login = function(req, res) {
    let usr = new User(req.body, false)
    usr.login().then(function(p) {
        req.session.user = {uname: usr.data.uname, gravatar: usr.gravatar, _id: usr.data._id}
        req.session.save(function() {
            res.redirect('/')
        })
    }).catch(function(p) {
        req.flash('errors', usr.errors)
        req.session.save(function() {
            res.redirect('/')
        })
    })
}

exports.authorizeUser = function(req, res, next) {
    if (req.session.user) {
        next()
    }
    else {
        req.flash('errors', 'Login required!')
        req.session.save(function() {
            res.redirect('/')
        })
    }
}

exports.register = function(req, res) {
    let usr = new User(req.body, false)
    usr.register().then(function(p) {
        req.session.user = {uname: usr.data.uname, gravatar: usr.gravatar, _id: usr.data._id}
        req.session.save(function() {
            res.redirect('/')
        })
    }).catch(function(p) {
        req.flash('errors', usr.errors)
        req.session.save(function() {
            res.redirect('/')
        })
    })
}

exports.logout = function(req, res) {
    req.session.destroy(function() {
        res.redirect('/')
    })
}

exports.viewProfile = async function(req, res) {
    try {
        let prf = await User.findProfileByUname(req.params.uname)
        let psts = await Post.findPostsByAuthor(prf.authorid)
        prf.posts = psts
        res.render('viewprofile', {profile: prf})
    } catch {
        res.render('404')
    }
}
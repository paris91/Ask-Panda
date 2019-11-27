const User = require('../Model/mdlUser')

exports.home = function(req, res) {
    if (req.session.user) {
        res.render("feed")
    }
    else {
        res.render("home", {errors: req.flash('errors')})
    }
}

exports.login = function(req, res) {
    let usr = new User(req.body)
    usr.login().then(function(p) {
        req.session.user = {uname: usr.data.uname, gravatar: usr.gravatar}
        req.session.save(function() {
            // res.send({redirect: '/'})
            res.redirect('/')
        })
    }).catch(function(p) {
        req.flash('errors', usr.errors)
        req.session.save(function() {
            // res.send({redirect: '/'})
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
        req.session.save()
        res.redirect('/')
    }
}

exports.register = function(req, res) {
    let usr = new User(req.body)
    usr.register().then(function(p) {
        req.session.user = {uname: usr.data.uname, gravatar: usr.gravatar}
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
        console.log('redirect logout is called')
        // res.send({redirect: '/'})
        res.redirect('/')
    })
}
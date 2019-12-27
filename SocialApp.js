const express = require("express")
const expressSession = require("express-session")
const mongoConnect = require("connect-mongo")(expressSession)
const flash = require("connect-flash")
const router = require("./router")
const markdown = require("marked")
const sanitizeHTML = require("sanitize-html")
const csrf = require("csurf")

let session = expressSession({
    secret: "Pari is developing this app to learn some JS",
    store: new mongoConnect({client: require("./db")}),
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60, httpOnly: true}
})

const socialapp = express()
socialapp.use(session)
socialapp.use(flash())
socialapp.use(express.urlencoded({extended: false}))
socialapp.use(express.json())
socialapp.use(express.static('Public'))  // folder
socialapp.set('views', 'Views')
socialapp.set('view engine', 'ejs')
socialapp.use(csrf())

socialapp.use(function(req, res, next) { 
    res.locals.csrfToken = req.csrfToken()   
    if(req.session.user) {
        req.currentUser = req.session.user._id
    } else {
        req.currentUser = 0
    }
    res.locals.user = req.session.user
    res.locals.scanUserInput = function(txt) {
        return sanitizeHTML(markdown(txt), {allowedTags:['p','br','ul','ol','li','strong','bold','i','h1','h2','h3','h4','h5','h6','em'], allowedAttributes:[]})
    }
    next()
})

socialapp.use('/', router)

socialapp.use(function(err, req, res, next) {
    if (err) {
        if (err.code == "EBADCSRFTOKEN") {
            req.flash('errors', 'Cross Site Forgery Detected!')
            req.session.save(function() {
                res.redirect('/')
            })
        } else {
            res.render("404")
        }
    }
})

const server = require("http").createServer(socialapp)
const io = require("socket.io")(server)
io.use(function(socket, next) {
    session(socket.request, socket.request.res, next)
})

io.on('connection', function(socket) {
    if(socket.request.session.user)
    socket.emit('init', {uname: socket.request.session.user.uname, gravatar: socket.request.session.user.gravatar})

    socket.on('sendToAll', function(data) {
        socket.broadcast.emit('msgToAll', {msg: sanitizeHTML(data.msg, {allowedTags: [], allowedAttributes: []}), uname: data.uname, gravatar: data.gravatar})
    })
})

module.exports = server

const express = require("express")
const expressSession = require("express-session")
const mongoConnect = require("connect-mongo")(expressSession)
const flash = require("connect-flash")
const router = require("./router")
const markdown = require("marked")
const sanitizeHTML = require("sanitize-html")

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

socialapp.use(function(req, res, next) {    
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


module.exports = socialapp

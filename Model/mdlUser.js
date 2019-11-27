const col_users = require("../db").db().collection("users")
const validator = require("validator")
const sanitizeHTML = require("sanitize-html")
const bcrypt = require("bcryptjs")
const md5 = require("md5")

let User = function(data) {
    this.data = data
    this.errors = []
}

User.prototype.clean = function() {
    if (typeof(this.data.uname) != 'string') {this.data.uname = ""}
    if (typeof(this.data.pswd) != 'string') {this.data.pswd = ""}
    if (typeof(this.data.rstpswd) != 'string') {this.data.rstpswd = ""}
    if (typeof(this.data.email) != 'string') {this.data.email = ""}

    if (this.data.rstpswd != this.data.pswd) {
        this.errors.push('Passwords do not match')
    }
    this.data = {
        uname: sanitizeHTML(this.data.uname.trim().toLowerCase(), {allowedAttributes: [], allowedTags: []}),
        pswd: this.data.pswd,
        email: sanitizeHTML(this.data.email.trim().toLowerCase(), {allowedAttributes: [], allowedTags: []})
    }
}

User.prototype.validate = function() {
    if (this.data.uname == "") {
        this.errors.push("Please provide a username")
        return
    }
    if (!validator.isAlphanumeric(this.data.uname)) {
        this.errors.push("Username can contain only letters and numerals")
        return
    }   
    if (this.data.email == "") {
        this.errors.push("Please provide your email")
        return
    }      
    if (!validator.isEmail(this.data.email)) {
        this.errors.push("The email provided is invalid")
        return
    }    
    if ( !(this.data.pswd.length >= 8 && this.data.pswd.length <=35)) {
        this.errors.push("Password must be atleast 8 characters")
    }
}

User.prototype.register = function() {
    return new Promise((resolve, reject) => {
        this.errors = []
        this.clean()
        this.validate()
        console.log(this.errors)
        if (!this.errors.length) {
            let salt = bcrypt.genSaltSync(10)
            this.data.pswd = bcrypt.hashSync(this.data.pswd, salt)
            col_users.insertOne(this.data).then(() => {
                this.getAvatar()
                resolve("register success")
            }).catch(() => {
                reject("register fail")
            })
        }
        else {
            reject("register fail")
        }
    })
}

User.prototype.login = function() {
    return new Promise((resolve, reject) => {
        this.clean()
        col_users.findOne({uname: this.data.uname}).then((userInfo) => {
            if (userInfo && bcrypt.compareSync(this.data.pswd, userInfo.pswd)) {
                this.data.email = userInfo.email
                this.getAvatar()
                resolve("login success")
            }
            else {
                reject("login fail")
            }
        }).catch(() => {
            reject("error occured on login")
        })
    })
}

User.prototype.getAvatar = function() {
    console.log(this.data.email)
    this.gravatar = `https://gravatar.com/avatar/${md5(this.data.email)}?s=80`
}

module.exports = User
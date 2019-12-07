const col_posts = require("../db").db().collection("post")
const sanitizeHTML = require("sanitize-html")
const ObjectID = require("mongodb").ObjectID

let Post = function(data, usr) {
    this.data = data
    this.data.usr = usr
    this.errors = []
}

Post.prototype.clean = function() {
    if (typeof(this.data.title) != 'string') { this.data.title = ''}
    if (typeof(this.data.content) != 'string') { this.data.content = ''}

    this.data = {
        title: sanitizeHTML(this.data.title.trim(), {allowedAttributes: [], allowedTags: []}),
        content: sanitizeHTML(this.data.content.trim(), {allowedAttributes: [], allowedTags: []}),
        createdDate: new Date(),
        author:  ObjectID(this.data.usr)
    }
}

Post.prototype.validate = function() {
    if (this.data.title == "") {
        this.errors.push("Post title is mandatory")    
        return    
    }
    if (this.data.content == "") {
        this.errors.push("Please enter post content")
        return
    }
}

Post.prototype.createPost = function() {
    return new Promise((resolve, reject) => {
        this.errors = []
        this.clean()
        this.validate()
        if (!this.errors.length) {
            col_posts.insertOne(this.data).then((postInfo) => {
                resolve("Post created successfully")
            }).catch(() => {
                reject("Something went wrong! Unable to create posts")
            })
        }
        else {
            reject("Post creation failed")
        }
    })
}

module.exports = Post
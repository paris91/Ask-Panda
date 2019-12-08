const col_posts = require("../db").db().collection("post")
const sanitizeHTML = require("sanitize-html")
const ObjectID = require("mongodb").ObjectID
const User = require("./mdlUser")

let Post = function(data, usr) {
    this.data = data
    this.data.usr = usr
    console.log(usr)
    this.errors = []
}

Post.prototype.clean = function() {
    if (typeof(this.data.title) != 'string') { this.data.title = ''}
    if (typeof(this.data.content) != 'string') { this.data.content = ''}

    this.data = {
        title: sanitizeHTML(this.data.title.trim(), {allowedAttributes: [], allowedTags: []}),
        content: sanitizeHTML(this.data.content.trim(), {allowedAttributes: [], allowedTags: []}),
        createdDate: new Date(),
        author: new ObjectID(this.data.usr)
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
        console.log(this.data)
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

// NOT A PROTOTYPE
Post.findPostByID = function(id) {
    return new Promise(async function(resolve, reject) {
        if (!((typeof(id) == "string") && (ObjectID.isValid(id)))) {
            reject('Invalid ID')
            return
        }

        // let pst = await col_posts.findOne({_id: new ObjectID(id)})
        let pst = await col_posts.aggregate([
            {$match: {_id: new ObjectID(id)}},
            {$lookup: {from: "users", localField: "author", foreignField: "_id", as: "authorInfo"}},
            {$unwind: "$authorInfo"},
            {$project: {
                title: 1,
                content: 1,
                createdDate: 1,
                authorInfo: 1
            }}            
        ]).toArray()

        pst = pst.map(function(x) {
            x.authorInfo = {
                uname: x.authorInfo.uname,
                gravatar: new User(x.authorInfo, true).gravatar
            }
            return x
        })[0]
        console.log(pst)
        if (pst) {
            resolve(pst)
        }
        else {
            reject('Unable to find post')
        }

    })
}

module.exports = Post
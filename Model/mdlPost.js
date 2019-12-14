const col_posts = require("../db").db().collection("post")
const sanitizeHTML = require("sanitize-html")
const ObjectID = require("mongodb").ObjectID
const User = require("./mdlUser")

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
        if (!this.errors.length) {
            col_posts.insertOne(this.data).then((postInfo) => {
                resolve(postInfo.ops[0]._id)
            }).catch(() => {
                reject("failure")
            })
        }
        else {
            reject("failure")
        }
    })
}

Post.prototype.updatePost = function() {
    return new Promise((resolve, reject) => {
        this.errors = []
        this.clean()
        this.validate()
        if (!this.errors.length) {
            col_posts.findOneAndUpdate({_id: new ObjectID(this._id)}, {$set: {title: this.data.title, content: this.data.content}}).then((p) => {
                resolve("success")
            }).catch(() => {
                reject("failure")
            })
        } 
        else {
            reject("failure")
        }       
    })
}

Post.removePost = function(id) {
    return new Promise((resolve, reject) => {
        col_posts.deleteOne({_id: new ObjectID(id)}).then(() => {
            resolve("success")
        }).catch(()=> {
            reject("failure")
        })
    })
}

// NOT A PROTOTYPE
Post.findPostByID = function(id, authorid) {
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
            x.isAuthor = (x.authorInfo._id == authorid)                
            x.authorInfo = {
                uname: x.authorInfo.uname,
                gravatar: new User(x.authorInfo, true).gravatar,                
            }                        
            return x
        })[0]
        
        if (pst) {
            resolve(pst)
        }
        else {
            reject('Unable to find post')
        }

    })
}

Post.findPostsByAuthor = async function(id) {
    return new Promise(async function(resolve, reject) {
        let psts = await col_posts.aggregate([
            {$match: {author: new ObjectID(id)}},
            {$project: {
                _id: 1,
                title: 1,
                createdDate: 1
            }},
            {$sort: {
                createdDate: -1
            }}
        ]).toArray()

        if(psts) {
            resolve(psts)
        } else {
            reject()
        }
    })
}

Post.searchPosts = function(searchText) {
    return new Promise(async function(resolve, reject) {
        try {
            searchText = sanitizeHTML(searchText.trim(), {allowedTags: [], allowedAttributes: []})
            let psts = await col_posts.aggregate([
                {$match: {$text: {$search: searchText}}},
                {$lookup: {from: "users", localField: "author", foreignField: "_id", as: "authorInfo"}},
                {$sort: {score: {$meta: "textScore"}}},
                {$unwind: "$authorInfo"},
                {$project: {
                    title: 1,
                    content: 1,
                    createdDate: 1,
                    authorInfo: 1
                }}                  
            ]).toArray()

            psts = psts.map(function(x) {              
                x.authorInfo = {
                    uname: x.authorInfo.uname,
                    gravatar: new User(x.authorInfo, true).gravatar,                
                }                        
                return x
            })            
    
            if(psts) {                
                resolve(psts)
            } else {
                reject("empty")
            }
        } catch {
            reject("failure")
        }

    })
}


module.exports = Post
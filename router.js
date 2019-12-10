const express = require("express")
const router = express.Router()

const ctrlUser = require('./Controller/ctrlUser')
const ctrlPost = require('./Controller/ctrlPost')

router.get('/', ctrlUser.home)
router.post('/login', ctrlUser.login)
router.post('/register', ctrlUser.register)
router.post('/logout', ctrlUser.logout)

router.get('/profile/:uname', ctrlUser.viewProfile)
router.get('/post/:id', ctrlPost.viewPost)

router.get('/createPost', ctrlUser.authorizeUser, ctrlPost.createPost)
router.get('/post/:id/edit', ctrlUser.authorizeUser, ctrlPost.editPost)
router.get('/post/:id/delete', ctrlUser.authorizeUser, ctrlPost.deletePost)
router.post('/newPost', ctrlPost.newPost)
router.post('/post/:id/edit', ctrlPost.updatePost)


module.exports = router
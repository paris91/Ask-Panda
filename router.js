const express = require("express")
const router = express.Router()

const ctrlUser = require('./Controller/ctrlUser')
const ctrlPost = require('./Controller/ctrlPost')

router.get('/', ctrlUser.home)
router.post('/login', ctrlUser.login)
router.post('/register', ctrlUser.register)
router.post('/logout', ctrlUser.logout)

router.get('/createPost', ctrlUser.authorizeUser, ctrlPost.createPost)
router.post('/newPost', ctrlPost.newPost)


module.exports = router
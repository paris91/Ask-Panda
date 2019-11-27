const express = require("express")
const router = express.Router()

const ctrlUser = require('./Controller/ctrlUser')

router.get('/', ctrlUser.home)
router.post('/login', ctrlUser.login)
router.post('/register', ctrlUser.register)
router.post('/logout', ctrlUser.logout)

module.exports = router
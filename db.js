const db = require("mongodb")
const dotenv = require("dotenv")
dotenv.config()

db.connect(process.env.CONNECTIONSTRING, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client) {
    module.exports = client;
    const socialapp = require("./SocialApp");
    socialapp.listen(process.env.PORT)
})
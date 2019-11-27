const db = require("mongodb")
const dotenv = require("dotenv")
dotenv.config()
console.log(typeof(Number.parseInt("ab")))
console.log(Number.parseInt("ab"))
if (Number.parseInt("28"))
{    console.log("yeah")   
}
db.connect(process.env.CONNECTIONSTRING, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client) {
    module.exports = client;
    const socialapp = require("./SocialApp");
    socialapp.listen(process.env.PORT)
})
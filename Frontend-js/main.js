import Search from './modules/search'
import Chat from './modules/chat'
import Register from './modules/register'

if (document.getElementById("searchBtn") != undefined) {
    new Search()
}

if (document.getElementById('chat') != undefined) {
    new Chat()
}

if (document.getElementById('frmRegister') != undefined) {
    new Register()
}
import Search from './modules/search'
import Chat from './modules/chat'

if (document.getElementById("searchBtn") != undefined) {
    new Search()
}

if (document.getElementById('chat') != undefined) {
    new Chat()
}

import axios from 'axios'
import DOMPurify from 'dompurify'

export default class Chat {
    constructor() {
        this.chatBody = document.getElementById('chat-body')
        this.chatHeader = document.getElementById('chat-head')
        this.chatCtrl = document.getElementById('chat-ctrl')
        this.chatCloseBtn = document.getElementById('close-chat')
        this.chatFrm = document.getElementById('frmChat')
        this.chatEdit = document.getElementById('edtChat')        
        this.events()
        this.openConnection()
        this.toggleChatScreen(true)
    }

    toggleChatScreen(OFF) {
        if (OFF) {
            this.chatBody.style.display = "none"
            this.chatCtrl.style.display = "none"
            this.chatCloseBtn.style.display = "none"
        } else {
            this.chatBody.style.display = ""
            this.chatCtrl.style.display = "flex"
            this.chatCloseBtn.style.display = ""
        }
    }

    events() {
        this.chatHeader.addEventListener('click', () => {
            this.toggleChatScreen(false)
        })

        this.chatCloseBtn.addEventListener('click', (e) => {
            e.preventDefault()
            this.toggleChatScreen(true)
        })

        this.chatFrm.addEventListener('submit', (e) => {
            e.preventDefault()
            this.sendMessageToAll()
        })
    }

    openConnection() {
        this.socket = io()
        this.socket.on('init', (usr) => {
            this.currentUser = usr.uname
            this.currentUserGravatar = usr.gravatar
        })

        this.socket.on('msgToAll', (data) => {
            this.chatBody.insertAdjacentHTML('beforeend',
                `<div class="chatFromMsg">
                    <img src="${data.gravatar}" class="imgGravatar" />
                    <p>${DOMPurify.sanitize(data.msg)}</p>
                </div>`)   
            this.chatBody.scrollTop = this.chatBody.scrollHeight
        })
    }

    sendMessageToAll() {
        this.socket.emit('sendToAll', {msg: this.chatEdit.value, uname: this.currentUser, gravatar: this.currentUserGravatar})
        this.chatBody.insertAdjacentHTML('beforeend',
            `<div class="chatToMsg">
                <img src="${this.currentUserGravatar}" class="imgGravatar" />
                <p>${DOMPurify.sanitize(this.chatEdit.value)}</p>
            </div>`)
        this.chatBody.scrollTop = this.chatBody.scrollHeight
        this.chatEdit.value = ""
        this.chatEdit.focus()
    }
}
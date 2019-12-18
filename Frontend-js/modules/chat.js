import axios from 'axios'

export default class Chat {
    constructor() {
        this.chatBody = document.getElementById('chat-body')
        this.chatHeader = document.getElementById('chat-head')
        this.chatCtrl = document.getElementById('chat-ctrl')
        this.chatCloseBtn = document.getElementById('close-chat')
        this.chatFrm = document.getElementById('frmChat')
        this.chatEdit = document.getElementById('edtChat')        
        this.events()
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
            console.log("I ran 1")
            this.toggleChatScreen(false)
        })

        this.chatCloseBtn.addEventListener('click', (e) => {
            console.log("I ran 2")
            e.preventDefault()
            this.toggleChatScreen(true)
        })
    }
}
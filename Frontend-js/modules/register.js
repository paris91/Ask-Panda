import axios from "axios"

export default class Register {
    constructor() {
        this.frmRegister = document.querySelector('#frmRegister')
        this.edtFields = this.frmRegister.querySelectorAll('input[type="text"], input[type="password"]')
        this.edtregname = document.getElementById('edtregname')
        this.edtregemail = document.getElementById('edtregemail')
        this.edtregpswd = document.getElementById('edtregpswd')
        this.edtconfirmpswd = document.getElementById('edtconfirmpswd')
        this.RegErr = false
        this.addErrorDivs()
        this.events()
    }

    addErrorDivs() {
        if(this.edtFields) {
            this.edtFields.forEach((f) => {
                f.insertAdjacentHTML('beforebegin' , '<div class="errLiveDiv"></div>')
            })
        }
    }

    evtValidateuname() {
        let err = ''
        if (this.edtregname.value == "") {
            err = 'User name is required..'
        } else if (/\W/.test(this.edtregname.value)) {
            err = 'Username can contain only letters and numerals'
        } else if (/\s/.test(this.edtregname.value)) {
            err = 'Username cannot contain spaces'
        } else if (/^\d+/.test(this.edtregname.value)) {
            err = 'Username must not start with a number'
        } else if (/\w{4,15}/.test(this.edtregname.value) == false) {
            err = 'Username must be 4 to 15 characters long'
        } else {
            err = ''
        }       

        if (err != '') { this.RegErr = true }
        this.edtregname.previousElementSibling.innerHTML = err  
    }

    evtValidateEmail() {
        let err = ''
        if (this.edtregemail.value == "") {
            err = 'email is required'
        } else if (/^\d/.test(this.edtregemail.value)) {
            err = 'Invalid. emails dont start with a number'
        } else if (!/^[a-z0-9_.]+@\w+\.\w+/i.test(this.edtregemail.value)) {
            err = 'Invalid email'            
        } else {
            err = ''
        }

        if (err != '') { this.RegErr = true }
        this.edtregemail.previousElementSibling.innerHTML = err
    }

    evtValidatePassword() {
        let err = ''
        if (this.edtregpswd.value == "") {
            err = "password is mandatory"
        } else if (!/(?=.{8,})/.test(this.edtregpswd.value)) {
            err = "password must be at least 8 characters"
        } else if (!/(?=.*\d{2,})/.test(this.edtregpswd.value)) {
            err = "password must contain at least 2 numbers"
        } else if (!/(?=.*[a-z]{2,})/i.test(this.edtregpswd.value)) {
            err = "password must contain at least 2 letters"
        } else {
            err = ''
        }

        if (err != '') { this.RegErr = true }
        this.edtregpswd.previousElementSibling.innerHTML = err
    }

    evtValidatePasswordMatch() {
        if(this.edtregpswd.value != this.edtconfirmpswd.value) {
            this.RegErr = true
            this.edtconfirmpswd.previousElementSibling.innerHTML = "passwords don't match"
        } else {
            this.edtconfirmpswd.previousElementSibling.innerHTML = ""
        }
    }

    events() {
        this.edtregname.addEventListener('blur', () => {
            this.evtValidateuname()
        })

        this.edtregemail.addEventListener('blur', () => {
            this.evtValidateEmail()
        })

        this.edtregpswd.addEventListener('blur', () => {
            this.evtValidatePassword()
        })

        this.edtconfirmpswd.addEventListener('blur', () => {
            this.evtValidatePasswordMatch()
        })
        
        this.frmRegister.addEventListener('submit', (e) => {                        
            this.RegErr = false
            this.evtValidateuname()
            this.evtValidateEmail()
            this.evtValidatePassword()
            this.evtValidatePasswordMatch()
            if (!this.RegErr) {
                axios.post('/register', {uname: this.edtregname.value, 
                                         email: this.edtregemail.value, 
                                         pswd: this.edtregpswd.value, 
                                         rstpswd: this.edtconfirmpswd.value}
                            ).then().catch()
            } else {
                e.preventDefault()
            }
        })
    }
}
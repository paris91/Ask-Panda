// register
document.getElementById('frmRegister').addEventListener('submit', function(e) {
    e.preventDefault()
    axios.post('/register', {
        uname: document.getElementById('edtregname').value,
        email: document.getElementById('edtregemail').value,
        pswd: document.getElementById('edtregpswd').value,
        rstpswd: document.getElementById('edtconfirmpswd').value
    }).then(function() {
        // nothing
    }).catch(function() {
        // nothing
    })
})

// login
document.getElementById('frmLogin').addEventListener('submit', function(e) {
    e.preventDefault()
    axios.post('/login', {
        uname: document.getElementById('edtloginname').value,
        pswd: document.getElementById('edtloginpswd').value
    }).then(function() {
        // nothing
    }).catch(function() {
        // nothing
    })
})
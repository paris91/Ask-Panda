// logout
document.getElementById('btnLogout').addEventListener('click', function(e) {
   axios.post('/logout', {}).then(function() {

   }).catch(function() {
       
   })
})
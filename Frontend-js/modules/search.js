import axios from "axios"

export default class Search {
    constructor() {
        this.mainDiv = document.getElementById("main")
        this.navbar = document.getElementById("navbar")        
        this.createSearchScreen()
        this.searchBtn = document.getElementById("searchBtn")  
        this.searchScreenDiv = document.getElementById("searchScreenDiv")  
        this.closeSearchBtn = document.getElementById("closeSearchBtn")        
        this.edtSearch = document.getElementById("edtSearch")  
        this.searchResultsDiv = document.getElementById("searchResultsDiv")
        this.waiter 
        this.events()
        this.toggleSearchScreen(true)
    }   
    
    createSearchScreen() {
        this.navbar.insertAdjacentHTML('afterend', 
            `<div id="searchScreenDiv">
                <div id="searchHeader">
                    <form action="" method="POST" id="searchForm">
                        <input type="text" id="edtSearch" placeHolder="What are you looking for..?"  autocomplete="false"/>  
                        <a id="closeSearchBtn" href="#"><i class="fas fa-times-circle fa-2x"></i></a>
                    </form>
                </div>
                <div id="searchResultsDiv">
                </div>
            </div>`)
    }

    toggleSearchScreen(OFF) {
        if (OFF) {                      
            this.searchBtn.style.visibility = "visible"              
            this.searchScreenDiv.style.display = "none"          
            this.mainDiv.style = ""
        }
        else {
            this.mainDiv.style.display = "none"
            this.searchBtn.style.visibility = "hidden"            
            this.searchScreenDiv.style.display = "flex"
        }
    }

    searchKeyPressHandler() {

        clearTimeout(this.waiter)
        
        this.waiter = setTimeout(() => {
            axios.post('/search', {searchText: this.edtSearch.value}).then((response) => {
                this.searchResultsDiv.innerHTML = ""
                if(response.data) {                                        
                    if (response.data.length) {
                        response.data.forEach(pst => {                       

                            this.searchResultsDiv.insertAdjacentHTML('afterbegin', `
                                <div class="post-tile">
                                    <a href="\\post\\${pst._id}"><h4> ${pst.title} </h4> </a>
                                    <h4> ${pst.createdDate}  </h4>
                                </div>
                            `)                            
                        })
                    } else {
                        this.searchResultsDiv.insertAdjacentHTML('afterbegin', '<h1>No results found 1</h1>')
                    }

                }
                else {
                    this.searchResultsDiv.insertAdjacentHTML('afterbegin', '<h1>No results found 2</h1>')
                }

            }).catch(() => {
                this.searchResultsDiv.insertAdjacentHTML('afterbegin', '<h1>Something went wrong with the search feature. Please let Pari Know..</h1>')
            })     
        }, 3000);
    }

    events() {
        this.searchBtn.addEventListener('click', (e) => {
            e.preventDefault()
            this.toggleSearchScreen(false)
        })

        this.closeSearchBtn.addEventListener('click', (e) => {
            e.preventDefault()
            this.toggleSearchScreen(true)
        })

        this.edtSearch.addEventListener("keyup", () => this.searchKeyPressHandler())
    }
}

import axios from "axios"

export default class Search {
    constructor() {
        this.mainDiv = document.getElementById("main")
        this.navbar = document.getElementById("navbar")        
        this.createSearchScreen()
        this.searchBtn = document.getElementById("searchBtn")  
        this.searchScreenDiv = document.getElementById("searchScreenDiv")  
        this.closeSearchBtn = document.getElementById("closeSearchBtn")            
        this.events()
    }   
    
    createSearchScreen() {
        this.navbar.insertAdjacentHTML('afterend', 
            `<div id="searchScreenDiv">
                <div id="searchHeader">
                    <form action="" method="POST" id="searchForm">
                        <input type="text" id="edtSearch" placeHolder="What are you looking for..?" />  
                        <a id="closeSearchBtn" href="#"><i class="fas fa-times-circle fa-2x"></i></a>
                    </form>
                </div>
                <div id="searchResults">
                </div>
            </div>`)
        document.getElementById("searchScreenDiv").style.display = "none"
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

    events() {
        this.searchBtn.addEventListener('click', (e) => {
            e.preventDefault()
            this.toggleSearchScreen(false)
        })

        this.closeSearchBtn.addEventListener('click', (e) => {
            e.preventDefault()
            this.toggleSearchScreen(true)
        })
    }
}

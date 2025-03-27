const API_LINK = "http://localhost:3000/";
const tableBody = document.querySelector("tbody");
let img; 
let menuItems = [];

// https://projectserver-te7c.onrender.com/api/

document.addEventListener("DOMContentLoaded", function main(){
    const form = document.querySelector("#form");
    document.querySelector("input[type='file'").addEventListener('change', handleFileInput)
    form.addEventListener("submit", postData)
    document.querySelector("contact-form").addEventListener('submit', sendMessage)
    getData()
    filter()
    search()
})

function getData(){
    return fetch(`${API_LINK}menuItems`)
    .then(res=>res.json())
    .then(data=>{
        menuItems = data 
        displayData(data)
        foodDisplay(data)
    })
}


function postData(e){
    e.preventDefault()
    const formdata = new FormData(e.target)     
    let data = {
        id : String(menuItems.length + 1),
        name: formdata.get("name"),
        diet: formdata.get("diet").split(" "),
        image: img,
        category: formdata.get("category"),
        description: formdata.get("description"),
        likes: 0
    }
    return fetch(`${API_LINK}menuItems`, {
        method: "POST",
        headers:{
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(res=>res.json())
    .then(data=>{
        menuItems.push(data)
        updateDisplays(data)
        e.target.reset()
    })
}


function displayData(data) {
    data.forEach(element => {
        tableBody.innerHTML += `
            <tr>
                <td>${element.name}</td>
                <td>${element.category}</td>
                <td>${element.description}</td>
            </tr>
        `
    });
}

const foodGallery = document.querySelector("#food-gallery")

function foodDisplay(data){
    data.forEach((food)=>{
        foodGallery.innerHTML += `
        <div class="card">
            <img src="${food.image}" class="card-img-top" alt="${food.name}">
            <div class="card-body">
                <h5 class="card-title">${food.name}</h5>
                <p class="card-text">${food.description}</p>
                <div class="flex">
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#foodModal">
                        View
                    </button>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
                        <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"/>
                    </svg>
                </div>
            </div>
        </div>
    `
    }) 

    const btns = foodGallery.querySelectorAll("button")
    btns.forEach((btn)=>{
        btn.addEventListener("click", handleClick)
    })

    const heart = document.querySelectorAll(".card-body div svg")
    heart.forEach((hrt)=>{
        hrt.addEventListener("click", handleLike)
    })
}

function handleLike(e){
    let p = e.target.parentNode.parentNode.firstElementChild;
    e.target.innerHTML = '<path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>'
    setTimeout(() => {
        e.target.innerHTML =  '<path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"/>'   
    }, 2000)
    menuItems.find((item, index)=>{
        if (item.name === p.textContent)
        {
            let likes = item.likes+1
            fetch(`${API_LINK}menuItems/${item.id}`,{
                method: 'PATCH',
                headers: {
                    "Content-Type":"application/json",
                    "accept":"application/json"
                },
                body: JSON.stringify({likes: likes})
            })
            .then(res=>res.json())
            .then(data=>{
                console.log(data)
                menuItems[index].likes = data.likes
            })
        }
    })

}

function handleClick(e) {
    let p = e.target.parentNode.parentElement.firstElementChild;
    const foodModalLabel = document.querySelector("#foodModalLabel")
    const image = document.querySelector(".modal-body img")
    const description = document.querySelector(".modal-body p")
    menuItems.find((item)=>{
        
        if (item.name === p.textContent){
            foodModalLabel.textContent = item.name
            image.src = item.image
            image.alt = item.name
            description.textContent = item.description
            
        }
    })
}

function updateDisplays(data){
    tableBody.innerHTML += `
            <tr>
                <td>${data.name}</td>
                <td>${data.category}</td>
                <td>${data.description}</td>
            </tr>
        `
    foodGallery.innerHTML += `
        <div class="card" style="width: 24rem;">
            <img src="${data.image}" class="card-img-top" alt="${data.name}">
            <div class="card-body">
                <h5 class="card-title">${data.name}</h5>
                <p class="card-text">${data.description}</p>
                <div>
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#foodModal">
                        View
                    </button>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
                        <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"/>
                    </svg>
                </div>
            </div>
        </div>
    `  
}

function handleFileInput(e) {
    const file = e.target.files[0];
    const reader = new FileReader;
    reader.onload = ()=>{
        // const blob = new Blob([reader.result])
        img = reader.result
    }  
    reader.readAsDataURL(file)
}
// "https://cdn.pixabay.com/photo/2022/06/07/20/52/curry-7249248_640.jpg"
// assets/images/applepie.jpeg
function filter(){
    let inputs = document.querySelectorAll("input[type='checkbox']");
    inputs.forEach((checkbox)=>{
        checkbox.addEventListener("change", handlefilter)
    })
}
function search (){
    const searchform = document.querySelector("form[role='search']")
    searchform.addEventListener('submit', handleSearch)
}   

function handlefilter(e){
    console.log(e.target.checked)
    if (e.target.checked)
    {
       let filtereditems = menuItems.filter((item)=>{
            for (let diet of item.diet){
    
                console.log(diet)
                if (e.target.value === diet){
                    return item
                }
            }
       })
       foodGallery.innerHTML = '' 
       foodDisplay(filtereditems)
    }
    else{
        foodGallery.innerHTML = '' 
        foodDisplay(menuItems)
    }
}

function handleSearch(e){
    e.preventDefault()
    let searchItem = e.target.search.value
    let regex = new RegExp(searchItem, "i")
    let filtereditems = menuItems.filter((item)=>{
        if(regex.test(item.name)){
            return item
        }
    })
    foodGallery.innerHTML = '' 
    foodDisplay(filtereditems)
}
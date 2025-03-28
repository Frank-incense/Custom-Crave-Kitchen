
const API_LINK = "http://localhost:3000/";
const tableBody = document.querySelector("tbody");
let img;
let menuItems = [];

document.addEventListener("DOMContentLoaded", function main(){
    const form = document.querySelector("#form");
    document.querySelector("input[type='file'").addEventListener('change', handleFileInput)
    form.addEventListener("submit", postData)
    document.querySelector("#contact-form").addEventListener('submit', sendMessage)
    getData()
    filter()
    search()
    addComments()
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

function sendMessage(e){
    e.preventDefault()
    const form = new FormData(e.target)
    const data = {
        firstName: form.get("firstname"),
        lastName: form.get("secondname"),
        phone: form.get("phone"),
        message: form.get("message")
    }
    fetch(`${API_LINK}messages`,{
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(res=>res.json())
    .then(messages => messages)
    e.target.reset()
    addComments()
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
            <tr id="${element.id}">
                <td>${element.name}</td>
                <td>${element.category}</td>
                <td>${element.description}</td>
                <td>
                    <button type="button" class="editbtn btn">Edit</button>
                    <button type="button" class="delbtn btn-secondary">Delete</button>
                </td>
            </tr>
        `
    });
    editFood()
    deleteFood()
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
    }, 2000);
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
                menuItems[index] = data.likes
            })
        }
    })

}

function handleClick(e) {
    let p = e.target.parentNode.parentElement.firstElementChild;
    const foodModalLabel = document.querySelector("#foodModalLabel")
    const image = document.querySelector(".modal-body img")
    const description = document.querySelector(".modal-body p")
    const likes = document.querySelector("#likes")
    menuItems.find((item)=>{
        
        if (item.name === p.textContent){
            foodModalLabel.textContent = item.name
            image.src = item.image
            image.alt = item.name
            description.textContent = item.description
            likes.textContent = item.likes
        }
    })
}

function updateDisplays(data){
    tableBody.innerHTML += `
            <tr id="${data.id}">
                <td>${data.name}</td>
                <td>${data.category}</td>
                <td>${data.description}</td>
                <td>
                    <button type="button" class="editbtn btn">Edit</button>
                    <button type="button" class="delbtn btn-secondary">Delete</button>
                </td>
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
    editFood()
    deleteFood()
}

function handleFileInput(e) {
    const file = e.target.files[0];
    const reader = new FileReader;
    reader.onload = ()=>{
        img = reader.result
    }  
    reader.readAsDataURL(file)
}

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

function patchData(dataObj){
    for (let key in dataObj){
        if (dataObj[key] === "")
        {
            delete dataObj[key]
        }
    }
    fetch(`${API_LINK}menuItems/${dataObj.id}`,{
        method: 'PATCH',
        headers: {
            "Content-Type":"application/json",
            "accept":"application/json"
        },
        body: JSON.stringify(dataObj)
    })
    .then(res=>res.json())
    .then(data=>{
        const tr = document.getElementById(data.id)
        tr.innerHTML = `
            <td>${data.name}</td>
            <td>${data.category}</td>
            <td>${data.description}</td>
            <td>
                <button type="button" class="editbtn btn">Edit</button>
                <button type="button" class="delbtn btn-secondary">Delete</button>
            </td>
        `
        menuItems[dataObj.id] = data
        
    })
}

function editFood(){
    const edit = document.querySelectorAll(".editbtn") 
    edit.forEach((editbtn =>{
        editbtn.addEventListener("click", editItem)
    }))
} 

function editItem(e){
    let parent = e.target.parentNode.parentElement
    const Update ={
        id : parent.id,
        name: prompt("Input updated name"),
        diet: prompt("Input updated diet"),
        category: prompt("Input updated category"),
        short: prompt("Input updated short Description"),
        description: prompt("Input updated Description")
    }
    patchData(Update)
}

function deleteFood() {
    const del = document.querySelectorAll(".delbtn");
    del.forEach(delbtn =>{
        delbtn.addEventListener("click", deleteItem)
    })
}

function deleteItem(e){
    let parent = e.target.parentNode.parentElement;
    parent.remove()
    console.log(parent)
    fetch(`${API_LINK}menuItems/${parent.id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(res=>res.json())
    .then(data=>data)
}

function addComments(){
    fetch(`${API_LINK}messages`)
    .then(res=>res.json())
    .then(messages => {
        displayMessage(messages)
    })
}

function displayMessage(messages){
    const listGroup = document.querySelector(".list-group")
    messages.forEach((message)=>{
        listGroup.innerHTML +=`
        <div class="list-group-item">
            <div>
                <span>${message.firstName.charAt(0)}${message.lastName.charAt(0)}</span>
                <span>${message.firstName} ${message.lastName}</span>
            </div>
            <p>${message.message}</p>
        </div>
        `
    })
}
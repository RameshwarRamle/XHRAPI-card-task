
cl = console.log;

const cardform = document.getElementById("cardform");
const titlecontrol = document.getElementById("title");
const contentcontrol = document.getElementById("content")
const idcontrol = document.getElementById("numbers");
const submitbtn = document.getElementById("submitbtn");
const updatebtn = document.getElementById("updatebtn");
const removebtn = document.getElementById("removebtn");
const loader = document.getElementById("loader");



const BASE_URL = "https://jsonplaceholder.typicode.com/";

const POST_URL = `${BASE_URL}/posts`;


function ontoggleloader(flag){
    if(flag){
        loader.classList.remove("d-none")
    }else{
        loader.classList.add("d-none")
    }
}


function snackbar(title, icon){
    swal.fire({
        title,
        icon,
        timer:2000
    })

}


function onEdit(ele){

    let card = ele.closest(".col-md-3");

    let EDIT_ID = ele.closest(".col-md-3").id;

    localStorage.setItem("EDIT_ID", EDIT_ID);

    const EDIT_URL = `${POST_URL}/${EDIT_ID}`;

    let xhr = new XMLHttpRequest();

    xhr.open("GET", EDIT_URL);


    xhr.onload = function(){

        if(xhr.status >= 200 && xhr.status<300){
            let res = JSON.parse(xhr.response)
            cl(res)      
            
            titlecontrol.value = res.title,
            contentcontrol.value = res.body,
            idcontrol.value = res.id


            let removeBtnOfThisCard = card.querySelector(".removebtn")
            removeBtnOfThisCard.classList.add("d-none")

            submitbtn.classList.add("d-none");
            updatebtn.classList.remove("d-none");
            
            
            cardform.scrollIntoView({ behavior: "smooth" });
    
        }
    }

    xhr.send(null)

   
}



function onremove(ele){
   let remove_id = ele.closest(".col-md-3").id

   const DELETE_URL = `${POST_URL}/${remove_id}`;

    let xhr = new XMLHttpRequest();

    xhr.open("DELETE", DELETE_URL);


    xhr.onload = function(){
        if(xhr.status>=200 && xhr.status<300){
            let data = xhr.response
            cl(data) 
            
            ele.closest(".col-md-3").remove();
            snackbar(`The post of id=(${remove_id}) deleted successfully`, "success")

        }else{
            snackbar(`Something went wrong while deleting post`, "error")
        }
    }
    xhr.send(null);

}

function createcards(arr){

    let result = arr.map((obj) =>{
        return`
            <div class="col-md-3" id=${obj.id}>
                <div class="card mb-5">
                    <div class="card-header">
                        <h3>${obj.title}<h3>
                    </div>
                    <div class="card-body">
                        <p>${obj.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-outline-primary btn-sm" onclick = "onEdit(this)">Edit</button>
                        <button  class="btn btn-outline-danger btn-sm removebtn" onclick = "onremove(this)">Remove</button>
                    </div>
                </div>
            </div>` 
    }).join('');

    cardcontainer.innerHTML = result;

}





function fetchallposts(){
    // ṣtep-1  >>  create instance/object of XMLHttpRequest
    let xhr = new XMLHttpRequest();


    // step-2  >> Configuration by using open method 
    xhr.open("GET", POST_URL);
    xhr.setRequestHeader("Auth", "Token from RAMESHWAR");


    // step-3 onloadfunction
    xhr.onload = function(){
        // check condition greater than 200 && less than 300 is success
        cl(xhr.readyState);

        if(xhr.status >= 200 && xhr.status < 300 && xhr.readyState === 4){
            let data = JSON.parse(xhr.responseText)
            // cl(data)
            createcards(data);
        }
    }

    xhr.send(null);
}
fetchallposts();




function onsubmit(eve){
    eve.preventDefault();


    let card_obj = {
        title:titlecontrol.value,
        body:contentcontrol.value,
        id:idcontrol.value
    }
    cl(card_obj);
    eve.target.reset();
    // create instance
    let xhr = new XMLHttpRequest();

    // configuration
    xhr.open("POST", POST_URL);

    // onload function to check response is success or not
    xhr.onload = function(){
        if(xhr.status>=200 && xhr.status<300){
            let res = JSON.parse(xhr.response)
            cl(res);

            let card = document.createElement("div");
            card.className = `col-md-3`;
            card.id = res.id;
            card.innerHTML = 
                `<div class="card mb-3">
                    <div class="card-header">
                        <h3>${card_obj.title}</h3>
                    </div>
                    <div class="card-body">
                        <p>${card_obj.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-outline-primary btn-sm" onclick = "onEdit(this)">Edit</button>
                        <button  class="btn btn-outline-danger btn-sm removebtn" onclick = "onremove(this)">Remove</button>
                    </div>
                </div>`
            cardcontainer.prepend(card);
            snackbar(`The post of id=${card.id} is created successfully`, "success")
        }else{
            snackbar(`Something went wrong while creating post`, "error")
        }

    }
    // send body
    xhr.send(JSON.stringify(card_obj))

}


function onupdate(){
    let UPDATED_ID = localStorage.getItem("EDIT_ID");

    const UPDATE_URL = `${POST_URL}/${UPDATED_ID}`;

    let updated_obj = {
                title:titlecontrol.value,
                body:contentcontrol.value,
                id:UPDATED_ID
            }
    
    cardform.reset();
    
    let xhr = new XMLHttpRequest();

    xhr.open("PATCH", UPDATE_URL)

    xhr.onload = function(){
        if(xhr.status>=200 && xhr.status<300){
            let res = JSON.parse(xhr.response)
            cl(res)

            card = document.getElementById(UPDATED_ID);
            cl(card);
            card.querySelector(".card-header h3").innerText = updated_obj.title
            card.querySelector(".card-body p").innerText = updated_obj.body

            updatebtn.classList.add("d-none");
            submitbtn.classList.remove("d-none");
            let removeBtnOfThisCard = card.querySelector(".removebtn");
            removeBtnOfThisCard.classList.remove("d-none"); 

            snackbar(`The post of id=${UPDATED_ID} updated successfully`, "success")
        }else{
            snackbar(`Something went wrong while updating post`, "error")
        }

    }
    xhr.send(JSON.stringify(updated_obj))

   
}

cardform.addEventListener("submit", onsubmit);
updatebtn.addEventListener("click", onupdate);




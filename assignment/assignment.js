
// Select the Elements
const clear = document.querySelector(".clear");
const dateElement = document.getElementById("date");
const list = document.getElementById("list");
const input = document.getElementById("input");

// Classes names
const CHECK = "fa-check-circle";
const UNCHECK = "fa-circle-thin";
const LINE_THROUGH = "lineThrough";
// Variables
let LIST, id;
var  database = firebase.database();
var ref = database.ref("assignment");
let arr;


ref.on("value", function (snapshot) {
    snapshot.forEach(function(childSnapshot) {
       var data = childSnapshot.val();
       addToDo(data.name, data.refid, data.done, data.trash);
      }) 

})

// clear the local storage
clear.addEventListener("click", function(){
    localStorage.clear();
    location.reload();
});



// Show todays date
const options = {weekday : "long", month:"short", day:"numeric"};
const today = new Date();
dateElement.innerHTML = today.toLocaleDateString("en-US", options);


// add to do function
function addToDo(toDo, id, done, trash){
    
    if(trash){ return; }
    
    const DONE = done ? CHECK : UNCHECK;
    const LINE = done ? LINE_THROUGH : "";
    
    const item = `<li class="item" id="${id}">
                    <i class="fa ${DONE} co" job="complete" id="${id}"></i>
                    <p class="text ${LINE}">${toDo}</p>
                    <i class="fa fa-trash-o de" job="delete" id="${id}"></i>
                  </li>
                `;
    
    const position = "afterbegin";
    
    list.insertAdjacentHTML(position, item);

    
}



// add an item to the list user the enter key
document.addEventListener("keyup",function(even){
    if(event.keyCode == 13){
        const toDo = input.value;
        // if the input isn't empty
         if(toDo){
         var database = firebase.database();
            var ref = database.ref("assignment");
           var refid= ref.push();
               var dat =  {
                name : toDo,
                done : false,
                trash : false, 
                refid: refid.key  
            };

           refid.set(dat);
    
            console.log("firebbac upload done and refid");
        
        }
        input.value = "";
   location.reload();
    }
});


// complete to do
function completeToDo(element){
    element.classList.toggle(CHECK);
    element.classList.toggle(UNCHECK);
    element.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);
    
    LIST[element.id].done = LIST[element.id].done ? false : true;

}

// remove to do
function removeToDo(element){
    element.parentNode.parentNode.removeChild(element.parentNode);
    
    firebase.database().ref('assignment/'+element.id).remove();
    location.reload();

}

// target the items created dynamically

list.addEventListener("click", function(event){
    const element = event.target; // return the clicked element inside list
    const elementJob = element.attributes.job.value; // complete or delete

    if(elementJob == "complete"){
        completeToDo(element);
    }else if(elementJob == "delete"){
        removeToDo(element);
        
    }
});




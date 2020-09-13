window.addEventListener('load',init);
let sigCodeArr = [];
let slides= null;
let slideIndex = null;
function init(){
    readTextFile('abbreviations.csv');
    slides = document.querySelector('.slideshow-container');
    
    slideIndex = 1;
    buildFlashCards();

}
    // Next/previous controls
    function plusSlides(n) {
    showSlides(slideIndex += n);
    }

    // Thumbnail image controls
    function currentSlide(n) {
    showSlides(slideIndex = n);
    }

    function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
        console.log(slides[i]);
    }

    slides[slideIndex-1].style.display = "block";
    } 
function buildFlashCards(){
    let divArr = '';
    let mainDiv = document.createElement("div"); 
        mainDiv.setAttribute('class', 'mySlides slide'); 
    sigCodeArr.forEach(function(item,index){
        
        let cardDiv = document.createElement("div"); 
        cardDiv.setAttribute('class', 'card');                 
       
        let frontCard = document.createElement("div");
        frontCard.setAttribute('class', 'front');  
        let textnode = document.createTextNode(sigCodeArr[index].code);         // Create a text node
        frontCard.appendChild(textnode); 
       
        let backCard = document.createElement("div");
        let textnode2 = document.createTextNode(sigCodeArr[index].meaning);         // Create a text node
        backCard.setAttribute('class', 'back');
        backCard.appendChild(textnode2); 
       
        cardDiv.appendChild(frontCard);
        cardDiv.appendChild(backCard);

          mainDiv.appendChild(cardDiv);
       // divArr+=`<div class="mySlides slide">${cardDiv}</div>`;
       
    });
    
   slides.insertAdjacentElement('beforeend',mainDiv);
   showSlides(1);
   
}

function readTextFile(file){
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
    rawFile.setRequestHeader("Access-Control-Allow-Origin", "*");
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                let allText = rawFile.responseText;
                let arr = allText.split("\n");
                arr.forEach(function(item,index){
                	
                    let code = item.split(",")[1];
                    let meaning = item.split(",")[2];
                    
                    if(code && meaning){
                        meaning.replace(/\\\//g,"");
                        let arrItem = {"code":code.trim(),"meaning":meaning.trim()};
                        sigCodeArr.push(arrItem);
                    }
                });
                 //remove column names from csv
                 sigCodeArr.shift();
            }
        }
    }
    rawFile.send(null);
}
  

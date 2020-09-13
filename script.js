window.addEventListener('load',init);
//Globals

const levels = {
    easy:15,
    medium:10,
    hard:5
}

const currentLevel = levels.easy;

let time = currentLevel;

let score = 0;
let isPlaying;
let quit = false;
let gameInterval = null;

let wordInput = null;
let currentWord = null;
let storeDisplay = null;
let timeDisplay = null;
let message = null;
let seconds = null;
let btnEnter = null;
let btnSkip = null;
let btnQuit = null;
let missedList = null;


let codeArr = [];
let copyArr = [];
let skippedIndices= [];
let currentIndex = 0;



  function init(){
      //redirect to start page
    readTextFile('abbreviations.csv');
   copyArr = codeArr.slice(0);
  
      //Load word from array
      wordInput = document.querySelector('#word-input');
     currentWord = document.querySelector('#currentWord');
     scoreDisplay = document.querySelector('#score');
     timeDisplay = document.querySelector('#time');
     message = document.querySelector('#message');
     seconds = document.querySelector('#seconds');
     btnEnter = document.querySelector('#btnEnter');
     btnSkip = document.querySelector('#btnSkip');
     btnQuit = document.querySelector('#btnQuit');
     btnMissedQuestions = document.querySelector('#btnMissed');
     missedList = document.querySelector('#missedList');

     btnEnter.addEventListener('click',startMatch);
     btnSkip.addEventListener('click',skipQuestion);
     btnQuit.addEventListener('click',()=>{quit=true});
    
     seconds.innerHTML = currentLevel;
   
      showWord(copyArr);
      //call countdown every seconds
     gameInterval = setInterval(countdown,1000);
     // setInterval(checkStatus,50);
  }

  function startMatch(){
      if(matchWords()){
           time += currentLevel + 1;//add time to next word
           showWord(copyArr);
           wordInput.value = '';
           score++;
      }
      if(score === -1){
        scoreDisplay.innerHTML = 0;
      }
      else{
        scoreDisplay.innerHTML = score;
      }    
  }

  function matchWords(){
      
    if(compare()){
        message.innerHTML = 'Correct!';
        return true;
    }
    else{
        message.innerHTML ='Wrong,try again';
        return false;
    }
  }

  function compare(){
 return( wordInput.value.toLowerCase() === copyArr[currentIndex].meaning.toLowerCase());
     
    
  }

  function showWord(copyArr){
      message.innerHTML = '';
      const randIndex = Math.floor(Math.random() * copyArr.length);
      currentIndex = randIndex;
      currentWord.innerHTML = copyArr[randIndex].code;
      copyArr.splice(randIndex,1);
      if(copyArr.length <=1){
          isPlaying = false;
      }  
  }

  function skipQuestion(){
      addToSkipArray();
    showWord(copyArr);
  }

  function addToSkipArray(){
    skippedIndices.push(currentIndex);
    copyArr.splice(currentIndex,1);
  }

  
  function countdown(){
    if(quit){
        handleQuit();
        return;
    }
      if(time > 0){
        time--;
      }
      
      else if(time === 0 && copyArr.length >=1 ){
        //check if word matches without user pressing Enter  
        if(!compare()){
            addToSkipArray();
        }
        showWord(copyArr);
          time = currentLevel;  
      }
      timeDisplay.innerHTML = time;
  }

  function checkStatus(){
    if(!isPlaying){
        if( copyArr.length <= 0){
            message.innerHTML = 'Game over!!!';
        }
    }
  }

  function handleQuit(){
    clearInterval(gameInterval);
    if(skippedIndices.length >= 1){
        seeMissed();
    }
    else{
        window.location = 'start.html';
    }
  }

  function seeMissed(){
    let list = '';
    if(skippedIndices.length <= 0){
        return;
    }
    skippedIndices.forEach(function(item,index){
    console.log(codeArr);
        list+=`<li>${codeArr[item].code} - ${codeArr[item].meaning}</li>`;
    });
    sessionStorage.setItem('missedList',list);
    window.location = 'missed.html';
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
                      
                        codeArr.push(arrItem);
                    }
                });
                 //remove column names from csv
                 codeArr.shift();
            }
        }
    }
    rawFile.send(null);
}
  
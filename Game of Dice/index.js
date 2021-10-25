// setting at the beginning
let selectedImg1 = document.querySelector(".img1");
let selectedImg2 = document.querySelector(".img2");
let selectedP1 = document.querySelector(".dice1 p");
let selectedP2 = document.querySelector(".dice2 p");
let selectedF1 = document.querySelector(".flag1");
let selectedF2 = document.querySelector(".flag2");
let selectedH1 = document.querySelector("h1");
let selectedH2 = document.querySelector("h2");

selectedImg1.style.cursor="pointer";
selectedImg2.style.cursor="pointer";
selectedP1.style.cursor="pointer";
selectedP2.style.cursor="pointer";
selectedH2.style.cursor="pointer";

selectedImg1.setAttribute("src", "images/dice6.png");
selectedImg2.setAttribute("src", "images/dice6.png");
selectedF1.style.visibility = "hidden";
selectedF2.style.visibility = "hidden";
selectedH2.style.visibility = "hidden";


// add Listener for player1 </p>
selectedP1.addEventListener("click",player1);
selectedImg1.addEventListener("click", player1);

// add Listener for <p> player2 </p>
selectedP2.addEventListener("click",player2);
selectedImg2.addEventListener("click", player2);

var i=0;
var randomNumber1,randomNumber2;

function player1() {
  // define by random player1's score
  randomNumber1 = Math.floor(Math.random() * 6 + 1);
  var imgDice1 = "images/dice" + randomNumber1 + ".png";
  // show dice1
  selectedImg1.setAttribute("src", imgDice1);
  //  attrebute onclick=""
  selectedImg1.setAttribute("onclick", "");
  //changes color
  selectedP1.style.color="red";
  selectedP1.removeEventListener("click", player1);
  selectedImg1.removeEventListener("click",player1);
  
  
  i++;
  if(i===2) {
    play();
  }
}

function player2() {
  // define by random player1's score
  randomNumber2 = Math.floor(Math.random() * 6 + 1);
  var imgDice2 = "images/dice" + randomNumber2 + ".png";
  // show dice2
  selectedImg2.setAttribute("src", imgDice2);
  //  attrebute onclick=""
  selectedImg2.setAttribute("onclick", "");
  //changes color
  selectedP2.style.color="red";
  selectedP2.removeEventListener("click", player2);
  selectedImg2.removeEventListener("click", player2); 
  i++;
  if(i===2) {
    play();
  }
}

function play() {

  //who is winner?
  if (randomNumber1 === randomNumber2) {
    selectedH1.innerHTML = "Draw!";
    selectedF1.style.visibility = "hidden";
    selectedF2.style.visibility = "hidden";
  } else {
    if (randomNumber1 > randomNumber2) {
      selectedH1.innerHTML = "Player 1 wins!";
      selectedF1.style.visibility = "visible";
      selectedF2.style.visibility = "hidden";
    } else {
      selectedH1.innerHTML = "Player 2 wins!";
      selectedF1.style.visibility = "hidden";
      selectedF2.style.visibility = "visible";
    }
  }
  selectedH2.style.visibility = "visible";

  selectedH2.addEventListener("click", () => {location.reload()});
}


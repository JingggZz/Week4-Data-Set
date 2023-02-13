
let loadbar = 0;
let failedLoads = [];
let jsonDocuments = [
  "./json/Chinese-Language.json",
  "./json/Written-Chinese.json",
  "./json/Traditional-Chinese-Language.json"
];

let canvas;
let files = [];
let displayText = "";

//data structure
let phrases = []; // for cut up generator


function setup() {
  canvas = createCanvas(800, 500);
  canvas.parent("sketch-container"); //move our canvas inside this HTML element
  canvas.mousePressed(handleCanvasPressed);

  loadFile(0);
}

function draw() {
  background(99, 18, 22);

  stroke(242, 200, 103)
  strokeWeight(2);
  noFill();
  rect(50, 50, 700, 400);

  if(loadbar < jsonDocuments.length){

    let barLength = width*0.5;
    let length = map(loadbar,0,jsonDocuments.length,barLength/jsonDocuments.length,barLength);
    rect(width*0.25,height*0.5,length,20);

  }else{

    let fontSize = map(displayText.length, 100, 500, 35, 20,true);
    textSize(fontSize);
    textWrap(WORD);
    textAlign(CENTER);

    fill(250, 192, 61);
    noStroke();
    text(displayText, 100, 100, 600);

  }

}

function handleCanvasPressed(){
  //original text
  displayText = "Don't show this boring sentence, generate some text instead!";

  //generate cut up phrases
  displayText = generateCutUpPhrases(3);

  //show text in HTML
  showText(displayText);

}

function buildModel(){
  console.log("run buildModel()");

  //phrases
  for(let i = 0; i < files.length; i++){

    let textPhrases = files[i].text.split(/(?=[.])/);
 
    for(let j = 0; j < textPhrases.length; j++){
      let phrase = textPhrases[j];
      let punctuationless = phrase.replace(/[^a-zA-Z- ']/g,"");//everything except letters, whitespace & '
  
      phrases.push(punctuationless);
    }

  }

}

//Text Generator Functions ----------------------------------

function generateCutUpPhrases(numPhrases){
  let output = "";

  //implement your code to generate the output
  for(let i = 0; i < numPhrases; i++){

    let randomIndex = int(random(0,phrases.length));
    let randomPhrase = phrases[randomIndex];

    output += randomPhrase + ". ";

  }


  return output;
}


//Generic Helper functions ----------------------------------

function loadFile(index){

  if(index < jsonDocuments.length){
    let path = jsonDocuments[index]; 

    fetch(path).then(function(response) {
      return response.json();
    }).then(function(data) {

      files.push(data);

      loadbar ++;
      loadFile(index+1);
  
    }).catch(function(err) {
      console.log(`Something went wrong: ${err}`);
  
      let failed = jsonDocuments.splice(index,1);
      console.log(`Something went wrong with: ${failed}`);
      failedLoads.push(failed);// keep track of what failed
      loadFile(index); // we do not increase by 1 because we spliced the failed one out of our array

    });
  }else{
    buildModel();//change this to whatever function you want to call on successful load of all texts
  }

}

//add text as html element
function showText(text){

  let textContainer = select("#text-container");
//  textContainer.elt.innerHTML = "";//add this in if you want to replace the text each time

  let p = createP(text);

  p.parent("text-container");

}

  
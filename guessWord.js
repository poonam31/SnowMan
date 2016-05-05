var inquirer = require('inquirer');
var fs = require('fs');

var file='words.txt';

//reads words.txt and randomly picks a word from file 
function getWords(file) {

    var data = fs.readFileSync(file, { encoding: 'utf8' }); 
    var words = data.split(' ');
  
    return words;
}

//removes the spaces from word
function removeSpace(word)
{
  var newWord=word.replace(/ /g,"");
  return newWord;
}

//shows X's i.e. no of guesses remaining
function showGuesses(number)
{
    var str="";
    for(var i=0;i<number;i++)
      str+="X ";

    return str;
}

function Guess(allWords)
{
  this.guessNo = 5;
  this.misses="";
  this.allWords=allWords;
  this.arr=[];

};


module.exports.run = function() {

 // var randomWord= getWord(file);
  var allWords= getWords(file);

  var word = new Guess(allWords);
  //console.log(word.randomWord);
  word.init();

}

//creates the word of dashes for selected random word
//and calls display function

Guess.prototype.init = function() {

  var word=this.getRandomWord();

  this.randomWord=word;

 // console.log("word =  "+word);

 var codeWord="";

 for(var i=0;i<word.length;i++)
  codeWord+="_ "

// console.log("code word=  "+codeWord);

// this.modword  ---- string of "_" for above randomWord.
// here we are adding the new property to Guess- 'this.modWord'
this.modWord=codeWord; 

this.displayWord();

}

Guess.prototype.getRandomWord = function(){

    var words = this.allWords;

    var randomWord = words[Math.floor(Math.random() * words.length)];

    if(this.ensureUnique(randomWord))
       return randomWord;
    else
       this.getRandomWord();

}


var arr=[];
Guess.prototype.ensureUnique= function (randomword)
{
      var arr=this.arr;

    if(arr.length>0 && arr.length<=10)
    {
        for(var i=0;i<arr.length;i++)
        {
             if(arr[i]==randomword)
              {
                return false;
              }
              else
               {}         
        }
       return true;
      }
    else 
    if(arr.length > 10)
    {
        arr=[];
        arr.push(randomword);
        this.arr=arr;
        return true;

    }
    else if(arr.length==0)
    {

        arr.push(randomword);
        this.arr=arr;
       // console.log(arr);
         return true;
    }
}

//displays the code word and asks for input

Guess.prototype.displayWord = function() {
  var self = this;

  inquirer.prompt([{
    type: 'input',
    name: 'letter',
    message: '\nWord: '+ this.modWord.toUpperCase() + '\n\nGuess: ',
  }], function(input) {
    self.getAnswer(input.letter);
  });

}

//makes the letter to lowercase and sends it to isRight funcction

Guess.prototype.getAnswer = function(letter1) {

  //console.log("letter entered = "+letter);

  var letter=letter1.toLowerCase();

  if(letter == "")
  {
     console.log("\nPlease enter a letter\n\nMisses: "+this.misses+"\n\nRemaining attempts: "+showGuesses(this.guessNo));

     this.displayWord();

  }
else{
        this.isRight(letter);  
    }
   
}

//check if the letter is present in word 
//if present : places the letter in code word correctly. tells user -> correct guess
//if no: tells user -> wrong guess
//this function will ask user for input till the time no. guesses reaches to 0 or the word is guessed by player

Guess.prototype.isRight = function(letter)
{
    //console.log("in get ans");

    var word = this.randomWord;

    //console.log("random word="+word);

    var modWord1 = this.modWord;
    var pos1 = modWord1.search(letter);
    var misses1 = this.misses;
    var pos2=misses1.search(letter);

    var pos= word.search(letter) ;

   // console.log("pos "+pos);

   if(pos1>=0 || pos2>=0)
   {
      //you have guessed letter enter other input
      //show him word and take input
      console.log("\nAlready guessed! Please try different letter.\n\nMisses: "+this.misses+"\n\nRemaining attempts: "+showGuesses(this.guessNo)+"\n");
   
      this.displayWord();
   }
   else
   {

      if(pos>=0) {
        
       console.log("\nCorrect guess.\n\nMisses: "+this.misses+"\n\nRemaining attempts: "+showGuesses(this.guessNo)+"\n");
      
       var str=this.modWord;
       //console.log("hhh str="+str);
       var j;
       var newStr="";
       
      for(var i=0;i<word.length ;i++)
      {
          if(word[i]==letter)
          {
            if(i==0) j=0;
            else j=i*2;

            newStr= newStr+letter+" ";
          }
          else
          {
              if(i==0) j=0;
              else  j=i*2;

              newStr= newStr+str[j]+" ";
          }
      } // end for loop

      this.modWord=newStr;

      var checkInCode = this.modWord;
      var p = checkInCode.search("_");
     
      if(p >= 0) 
      {          
         this.displayWord();
      }
      else {
          // congrats! word correct...ask if want to play again
     
          var correctWord=removeSpace(this.modWord)
         
          console.log("\nCongrats!..You won!! Word is: "+correctWord.toUpperCase()+"\n");

          this.playAgain();

      }
      
     } // end if (pos>=0)

    else {
      
        //do something here if pos<0 i.e given input is not present 

        //decrease no. of guesses
        this.guessNo--; 

       // (check if no. of guesses are > 0 then display modified word and take input 
       // if no. of guesses are = 0 , then show the correct ans and ask if want to play again

        if(this.guessNo > 0)
        {
            var miss=this.misses;

            if(miss=="") 
               miss+=letter;
            else
               miss+=","+letter;

            this.misses = miss;

            console.log("\nSorry! Wrong guess.\n\nMisses: "+this.misses+"\n\nRemaining attempts: "+showGuesses(this.guessNo)+"\n");
                    
            this.displayWord();   
        }
        else if(this.guessNo == 0)
        {
            var miss=this.misses;

            if(miss=="") 
              miss+=letter;
           else
             miss+=","+letter;

            this.misses = miss;

            console.log("\nSorry! You lost.\n\nMisses: "+this.misses+"\n\nNo remaining attempts");

            var correctWord= removeSpace(this.randomWord);
                    
            console.log("\nThe word was: "+correctWord.toUpperCase()+"\n");

            this.playAgain();
      }

    } // end of else -- if pos <0

  }
}

//asks player if want to play again
//if yes call init method
Guess.prototype.playAgain = function() {

  var self = this;

  inquirer.prompt([{
    type: 'confirm',
    name: 'answer',
    message: 'Do you want to play again?',
  }], function(input) {

    if (input.answer) {

      var words = getWords(file);
      var word = new Guess(words);
      word.init();
    } else {

      console.log('\nGoodbye...');
    }

  });
}


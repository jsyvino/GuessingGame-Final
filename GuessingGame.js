
var winMess="You Win Rockstar!";
var loseMess='You Lose    =(';
var repMess= "You've already guessed that number...";

function generateWinningNumber(){
    return Math.floor(Math.random()*100+1)
}

function shuffle(arr){
    var m= arr.length-1;
    var curr, temp;
    while(m){
        curr= Math.floor(Math.random()*m);
        temp = arr[m];
        arr[m]=arr[curr];
        arr[curr]= temp;
        m--;
    } return arr;
}


function Game(){
    this.playersGuess= null;
    this.pastGuesses=[];
    this.winningNumber=generateWinningNumber();
    this.hintCount=0;
    this.hint=[];
}

Game.prototype.difference = function(){
    return Math.abs(this.playersGuess-this.winningNumber);
}

Game.prototype.isLower= function(){
    return (this.playersGuess<this.winningNumber);
}

Game.prototype.playersGuessSubmission= function(num){
    if(num<1||num>100||isNaN(num)){
        return "Invalid guess; number must be between 1 and 100.";
    } else {
    this.playersGuess=num;
    return  this.checkGuess();
    }
}

Game.prototype.checkGuess= function(){
    if(this.difference()===0) return winMess;
    else if(this.pastGuesses.indexOf(this.playersGuess)>-1){
          return repMess;
    } else this.pastGuesses.push(this.playersGuess);
    
    if(this.pastGuesses.length>=5) return loseMess;
    else if(this.difference()<10) return 'You\'re burning up!';
    else if(this.difference()<25) return 'You\'re lukewarm';
    else if(this.difference()<50) return 'You\'re a bit chilly';
    else return 'You\'re ice cold!';
}

Game.prototype.provideHint= function(){
    if(this.hintCount===0){
    var hint=[this.winningNumber, generateWinningNumber(), generateWinningNumber()];
    this.hintCount++;
    this.hint=hint;
    return shuffle(hint);}
    else return "You only get one hint!  Your's was "+ this.hint.join(', ');
}


var newGame= function(){
    return new Game();
}

function submitGuess(game){
    var input= +$('#player-input').val();
        $('#player-input').val("");
        var submessage= '';
        var message= game.playersGuessSubmission(input);
        updateUL(game);
        if(message===repMess) submessage= "Guess Again!";
        else if(message=== winMess||message===loseMess){ 
            submessage= 'Wanna Play Again? Click "Start Over"';
            $('#hint, #submit').prop("disabled", true);
        }
        else if(game.isLower()) submessage= "Guess Higher";
        else submessage="Guess Lower";

        $('#title').text(message);
        $('#subtitle').text(submessage);
        if(message===winMess) $('body').addClass('winning');
        if(message===loseMess){
            $('#losing').show();
        }
        console.log(input, game.winningNumber, game.pastGuesses);
}

function updateUL(game){
    console.log('huh');
    if(game.pastGuesses.length===1) $("li").first().text(game.pastGuesses[0]);
    if(game.pastGuesses.length===2) $("li").first().next().text(game.pastGuesses[1]);
    if(game.pastGuesses.length===3) $("li").first().next().next().text(game.pastGuesses[2]);
    if(game.pastGuesses.length===4) $("li").last().prev().text(game.pastGuesses[3]);
    if(game.pastGuesses.length===5) $("li").last().text(game.pastGuesses[4]);
}

function showHint(game){
        $('#hint-reminder').slideToggle();
}

//make sure DOM is ready!
$(document).ready(function(){
    //start of code
    var game= newGame();

    $('#submit').on('click', function(){
        submitGuess(game);
    });
    $('#player-input').keypress(function(event){
        if(event.which==13){
            submitGuess(game);
        }
    });

    $('#hint').on('click', function(){
        if(game.hintCount===0){
        var hint= game.provideHint();
        $('#title').text("The winning number is: "+game.hint);
        $('#hint-reminder').text("Your Hint: "+ game.hint.join(', '));
        }
        else $('#title, #hint-reminder').text("You only get one hint! Your's was "+ game.hint.join(', '));
        $('#subtitle').text('Now, guess again!');
    });

    $('#hint').on('mouseenter', showHint);
    $('#hint').on('mouseleave', showHint);

    $('#reset').on('click', function(){
        game = newGame();
        $('#title').text('Play the Mystery Number Game!');
        $('#subtitle').text('Guess a number between 1 and 100...good luck!');
        $('body').removeClass('winning')
        $('#losing').hide();
        $('.guess').text('-');
        $('#hint, #submit').prop("disabled", false);
        $('#hint-reminder').text("C'mon, you know you want one!");
    });

//end of code
});

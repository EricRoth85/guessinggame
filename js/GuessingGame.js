//First, you'll need to create a constructor function, Game, that will create your game instances. You'll define all the methods that can modify or read data from game on Game.prototype. You'll also need a couple of helper functions that are not defined on Game.prototype, but will be used inside the instance methods.

function Game(){
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

function generateWinningNumber() {
    // return Math.floor(Math.random() * 100) + 1;
    return Math.ceil(Math.random()*100);
}

function newGame() {
    return new Game();
}

// Game.prototype.difference = function() {
//     if(this.playersGuess > this.winningNumber) {
//         return this.playersGuess - this.winningNumber;
//     } else if(this.playersGuess < this.winningNumber) {
//         return this.winningNumber - this.playersGuess;
//     } else {
//         return 0;
//     }
// }

Game.prototype.difference = function() {
    return Math.abs(this.playersGuess-this.winningNumber);
}

Game.prototype.isLower = function() {
    return this.playersGuess < this.winningNumber;
    //will be true or false
}

Game.prototype.playersGuessSubmission = function(num) {
    if(num < 1 || num > 100 || typeof num !== "number") {
        throw "That is an invalid guess."
    } else {
        this.playersGuess = num;
    }
    return this.checkGuess();
}

Game.prototype.checkGuess = function() {
    if (this.playersGuess === this.winningNumber) {
        $('#hint, #submit').prop("disabled", true);
        $('#winLoseWrap').toggleClass("hidden");
        $('#winLosenote').text("You Win!");
        return 'You Win! '
    } else {
        if (this.pastGuesses.includes(this.playersGuess)) {
            return 'You have already guessed that number.';
        } else {
            this.pastGuesses.push(this.playersGuess);
            $('#guess-list li:nth-child(' + this.pastGuesses.length + ')').text(this.playersGuess);
            if (this.pastGuesses.length === 5) {
                $('#hint, #submit').prop("disabled", true);
                $('#winLoseWrap').toggleClass("hidden");
                $('#winLosenote').text("You Lose!");
                return 'You Lose. ';
            } else {
                if (this.isLower()) {
                    $('#note-2').text("Guess Higher!");
                } else {
                    $('#note-2').text("Guess Lower!");
                }
                var diff = this.difference();
                if (diff < 10) return 'You\'re burning up! ';
                else if (diff < 25) return 'You\'re lukewarm. ';
                else if (diff < 50) return 'You\'re a bit chilly. ';
                else return 'You\'re ice cold! ';
            }
        }
    }
}

Game.prototype.provideHint = function() {
    var hintArr = []
    hintArr.push(this.winningNumber, generateWinningNumber(), generateWinningNumber());

    return shuffle(hintArr);
}

function shuffle(arr) {
    for(var i = arr.length-1; i > 0; i--) {
        var randomIndex = Math.floor(Math.random() * (i+1))
        var temp = arr[i];
        arr[i] = arr[randomIndex];
        arr[randomIndex] = temp;
    }
    return arr;
}

function makeAGuess(game) {
    var guess = $("#players-input").val();
    $("#players-input").val("");
    var output = game.playersGuessSubmission(parseInt(guess, 10));
    $('#note-1').text(output);
}

$(document).ready(function() {
    var game = new Game();

    $('#submit').click(function() {
       makeAGuess(game);
    })

    $('#players-input').keypress(function(event) {
        if(event.which == 13) {
           makeAGuess(game);
        }
    })

    $('#hint').click(function() {
        var hints = game.provideHint();
        $('#note-1').text('The winning number is '+hints[0]+', '+hints[1]+', or '+hints[2]);
    });

    $('.reset').click(function() {
        game = newGame();
        $('#note-1').text('');
        $('#note-2').text('');
        $('#subtitle').text('Guess a number between 1-100!')
        $('.guess').text('#');
        $('#hint, #submit').prop("disabled",false);
        $('#winLoseWrap').toggleClass("hidden");
    })
})



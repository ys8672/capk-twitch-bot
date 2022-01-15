const fs = require('fs');
const { commands } = require('../utils/constants');
const { isBroadcasterOrMod, setCharAt } = require('../utils/index');
const { getSavedData, updateSavedData } = require('../data/index');
const { addTTS } = require('../commands/tts')

// HANGMAN VARIABLES
/* String list of all the words the Hangman bot can choose from.
	Words come from dictionary.json and initialized in connected. */
let dictionary = [];
/* String list of users who are on cooldown on guessing letters. */
const letterCooldown = {};
/* String list of users who are on cooldown on guessing words. */
const wordCooldown = {};
/* String list of letters that have been guessed. */
const letterGuess = [];
/* Letter cooldown in milliseconds.*/
const letterCooldownTime = 30000;
/* Word cooldown in milliseconds.*/
const wordCooldownTime = 90000;
/* Boolean for whether a game of Hangman has started. */
let started = false;
/* Hangman guesses remaining. */
let lives = 6;
/* Word that Hangman bot randomly selected for the game. */
let dictionaryWord = "";
/* Current progress of Hangman word guess. */
let word = "";

const isGuess = message => (message.startsWith(commands.GUESS) && message.split(" ")[0] === commands.GUESS);
const isGuessWord = message => (message.startsWith(commands.GUESS_WORD) && message.split(" ")[0] === commands.GUESS_WORD);

/*
	 * Command: !start
	 * Permissions: Broadcaster and mods only.
	 * Manually starts a new Hangman game for chat to play.
	 */
const start = ({ channel, client, user }) => {
    if(isBroadcasterOrMod(user)){
        if(started){
            // If a Hangman game is in progress, nothing happens.
            client.say(channel, `A Hangman game is already in progress!`);
        } else {
            // Resets all previous scores and data.
            for(const key in letterCooldown) {
                delete letterCooldown[key];
            }
            for(const key in wordCooldown) {
                delete wordCooldown[key];
            }
            lives = 6;
            letterGuess.length = 0;

            // Picks a new word.
            dictionaryWord = dictionary[Math.floor(Math.random() * dictionary.length)];
            dictionaryWord = dictionaryWord.trim().toUpperCase();
            word = new Array(dictionaryWord.length + 1).join('-');

            // Prints to console the random word selected so the broadcaster knows.
            console.log(`The word selected is: ${dictionaryWord}`);
            addTTS(`A hang man game has started!`, 1.0);
            client.say(channel, `A Hangman game has started! Use "!guess <letter>" or "!guessword <word>" to play. Progress: ${word}.`);
            started = true;
        }
    }
};

/*
	 * Command: !end
	 * Permissions: Broadcaster and mods only.
	 * Manually ends a game.
	 */
const end = ({ channel, client, user }) => {
    if(isBroadcasterOrMod(user) && started){
        started = false;
        addTTS(`The hang man game has ended!`, 1.0);
        client.say(channel, `The Hangman game has ended.`);
    }
};

const guessLetter = ({ channel, client, message, name }) => {
    /*
	 * Command: !guess <letter>
	 * Permissions: Everybody.
	 * When a Hangman game is active, this command is used to guess a letter.
	 * Command will fail if there is no Hangman game, the user is on the 30
	 * seconds cooldown, not a a-z letter guess, or letter has been guessed.
	 */

    let strArray = message.split(" ");

    if(!started) {
        // Game not started.
        client.say(channel, `@${name} There is no Hangman game in progress.`);
    }  else if ((name in letterCooldown) && (letterCooldown[name] > Date.now())) {
        // User still on cooldown.
        client.say(channel, `@${name} You are on letter cooldown for ${Math.round((letterCooldown[name] - Date.now())/1000)} seconds!`);
    }  else if (strArray.length !== 2 || strArray[1].length !== 1 || !((/[a-zA-Z]/).test(strArray[1]))) {
        // Invalid guess.
        client.say(channel, `@${name} Invalid "${commands.GUESS} <letter>" usage. Guess one letter. Example: "${commands.GUESS} a"`);
    } else if (letterGuess.includes(strArray[1].toUpperCase())) {
        // Letter has already been guessed.
        client.say(channel, `@${name} "${strArray[1].toUpperCase()}" has been guessed. Guessed: ${letterGuess.join(', ')}.`);
    } else {
        // Cooldown applied.
        if(letterCooldown[name]) {
            delete letterCooldown[name];
        }
        letterCooldown[name] = Date.now() + letterCooldownTime;

        // Add letter to guesses.
        let charGuess = strArray[1].toUpperCase();
        letterGuess.push(charGuess);
        letterGuess.sort();

        // Check if the letter was a correct guess.
        let times = 0;
        for (let i = 0; i < dictionaryWord.length; i++) {
            if(dictionaryWord.charAt(i) === charGuess) {
                word = setCharAt(word, i, charGuess);
                times++;
            }
        }

        if(times > 0) {
            // Correct guess.
            if(dictionaryWord === word) {
                // Winner, so upload stats and announce win.
                getSavedData().wins++;
                getSavedData().total++;
                getSavedData().leaderboard[name] = (getSavedData().leaderboard[name]+1) || 1 ;
                updateSavedData(getSavedData());
                started = false;
                addTTS(`Congratulations ${name}! The word is: ${dictionaryWord}!`, 1.0);
                client.say(channel, `@${name} You win! Word is "${dictionaryWord}". ${getSavedData().wins}/${getSavedData().total} wins.`);
            } else {
                if(times === 1) {
                    addTTS(`1 ${charGuess}.`, 1.0);
                } else {
                    addTTS(`${times} ${charGuess}'s.`, 1.0);
                }
                //Correct, but more letters to be guessed.
                client.say(channel, `@${name} ${times} "${charGuess}". Lives: ${lives}. Guessed: ${letterGuess.join(', ')}. Progress: ${word}.`);
            }

        } else {
            // Incorrect guess.
            lives--;

            if(lives === 0){
                // Game over
                getSavedData().total++;
                updateSavedData(getSavedData());
                started = false;
                addTTS(`GAME OVER! The word is: ${dictionaryWord}!`, 1.0);
                client.say(channel, `@${name} GAME OVER. No "${charGuess}". Guessed: ${letterGuess.join(', ')}. Final progress: ${word}. Actual Word: "${dictionaryWord}". ${getSavedData().wins}/${getSavedData().total} wins.`);
            } else {
                // Incorrect, but there are still lives remaining.
                addTTS(`No ${charGuess}.`, 1.0);
                client.say(channel, `@${name} No "${charGuess}". Lives: ${lives}. Guessed: ${letterGuess.join(', ')}. Progress: ${word}.`);
            }
        }
    }
};

const guessWord = ({ channel, client, message, name }) => {
    /*
	 * Command: !guessword <word>
	 * Permissions: Everybody.
	 * When a Hangman game is active, this command is used to guess the word.
	 */
    let strArray = message.split(" ")
    if(!started) {
        // Game not started.
        client.say(channel, `There is no Hangman game in progress.`);
    }  else if ((name in wordCooldown) && (wordCooldown[name] > Date.now())) {
        // User on word cooldown.
        client.say(channel, `@${name} You are on word cooldown for ${Math.round((wordCooldown[name] - Date.now())/1000)} seconds!`);
    }  else if (strArray.length !== 2) {
        //Invalid guess
        client.say(channel, `Invalid "${commands.GUESS_WORD} <word>" usage. Guess a word. Example: "${commands.GUESS_WORD} salmon"`);
    } else {
        // Add word cooldown.
        if(wordCooldown[name]) {
            delete wordCooldown[name];
        }
        wordCooldown[name] = Date.now() + wordCooldownTime;

        let wordGuess = strArray[1].toUpperCase();
        letterGuess.push(wordGuess);
        letterGuess.sort();

        if(dictionaryWord === wordGuess){
            // Correct word guess, so game is recorded.
            getSavedData().wins++;
            getSavedData().total++;
            getSavedData().leaderboard[name] = (getSavedData().leaderboard[name]+1) || 1 ;
            updateSavedData();
            started = false;
            addTTS(`Congratulations ${name}! The word is: ${dictionaryWord}!`, 1.0);
            client.say(channel, `@${name} You win! Word is "${dictionaryWord}". ${getSavedData().wins}/${getSavedData().total} wins!`);
        } else {
            // Word guess was incorrect.
            lives--;

            if(lives === 0){
                // Game over.
                getSavedData().total++;
                updateSavedData(getSavedData());

                started = false;
                addTTS(`GAME OVER! The word is: ${dictionaryWord}!`, 1.0);
                client.say(channel, `@${name} GAME OVER. No "${wordGuess}". Guessed: ${letterGuess.join(', ')}. Final progress: ${word}. Actual word: "${dictionaryWord}". ${getSavedData().wins}/${getSavedData().total} wins`);
            } else {
                // More lives, so game not over yet but incorrect word guess.
                addTTS(`The word is not "${wordGuess}".`, 1.0);
                client.say(channel, `@${name} No "${wordGuess}". Lives: ${lives}. Guessed: ${letterGuess.join(', ')}. Progress: ${word}.`);
            }
        }
    }
};

const leaderBoard = ({ channel, client }) => {
    /*
	 * Command: !leaderboard
	 * Permissions: Everybody.
	 * Get the top 10 players on the Hangman leaderboard.
	 */
    let result = Object
        .keys(getSavedData().leaderboard)
        .map(key => ({id: String(key), val: getSavedData().leaderboard[key]}));

    let masterList = result.sort(function (a, b) {
        return b.val - a.val;
    });

    masterList = masterList.splice(0, 10);

    let leaderboard = masterList.map(function(el) {
        return el.id + ": " + el.val;
    });

    leaderboard = leaderboard.toString().replace(/,/g, ', ');
    client.say(channel, `Top 10 Hangman players: ${leaderboard}`);
};

const loadDictionary = () => {
    dictionary = fs.readFileSync('dictionary.txt').toString().split("\n");
};

const stats = ({ channel, client, name }) => {
    /*
	 * Command: !savedData
	 * Permissions: Everybody.
	 * Find out your own stats on the Hangman leaderboard.
	 */
    let val = 0;
    if(name in getSavedData().leaderboard){
        val = getSavedData().leaderboard[name];
    }
    client.say(channel, `@${name} has won ${val} Hangman games!`);
};

module.exports = {
    end,
    guessLetter,
    guessWord,
    isGuess,
    isGuessWord,
    leaderBoard,
    loadDictionary,
    start,
    stats
}
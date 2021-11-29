// Imports
const fs = require('fs');
const say = require('say');
const tmi = require('tmi.js');

// LURK COMMAND VARIABLES
/* Object of lurkers and the time they started lurking.*/
const lurkers = {};

// TEXT-TO-SPEECH VARIABLES
/* Speed the text-to-speech reads the message. 1.0 is normal, 0.5 is half 
	speed, and 2.0 is 2x speed. */
const ttsSpeed = 1.0;
/* Sub tier mapped from tmi API response to normal English words.*/
const tierList = { "1000": "Tier 1", "2000": "Tier 2", "3000": "Tier 3" };
/* TEXT-TO-SPEECH is on or off. */
let ttsOn = true;
/* List of messages the TTS will read in order. */
let ttsQueue = [];

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
let guessWord = "";

// MISC VARIABLES
/* 
 * Data that can be saved and loaded next time bot is opened. 
 * @param ttsBanList Users banned from using TTS.
 * @param wins Number of Hangman wins.
 * @param total Number of total Hangman games played.
 * @param leaderboard Current users who have the highest correct Hangman guesses.
 */
let savedData = {ttsBanList: [], wins: 0, total: 0, leaderboard: {}}

/*
 * Checks if user is either the broadcaster or a moderator.
 * @param user Object with all information about the user.
 */
 function isBroadcasterOrMod(user) {
	return 'broadcaster' in user.badges 
		|| (isRealValue(user["mod"]) && (user["mod"] === true));
 }
 
/*
 * Checks if user is either a VIP or subscriber.
 * @param user Object with all information about the user.
 */
 function isSubOrVIP(user) {
	return 'subscriber' in user.badges 
		|| 'founder' in user.badges 
		|| 'vip' in user.badges;
 }

/*
 * Converts number from milliseconds to readable time.
 * @param milliseconds Milliseconds to convert (1 ms = 1000s).
 */
function parseTime(milliseconds){
	//Get hours from milliseconds
	const hours = milliseconds / (1000*60*60);
	const absoluteHours = Math.floor(hours);

	//Get remainder from hours and convert to minutes
	const minutes = (hours - absoluteHours) * 60;
	const absoluteMinutes = Math.floor(minutes);

	//Get remainder from minutes and convert to seconds
	const seconds = (minutes - absoluteMinutes) * 60;
	const absoluteSeconds = Math.floor(seconds);

	let string = "";
	if(absoluteHours > 0){
		string += absoluteHours + ' hours ';
	}
	if(absoluteMinutes > 0){
		string += absoluteMinutes + ' minutes ';
	}
	return string + absoluteSeconds + ' seconds';
}

/*
 * Reads the first text-to-speech message in the ttsQueue, then continues until
 * all messages have been read out loud.
 */
function ttsReader(){
	say.speak(ttsQueue[0], null, ttsSpeed, (err) => {
		ttsQueue = ttsQueue.slice(1);
		if(ttsQueue.length > 0){
			ttsReader();
		}
	});
}

/*
 * Adds a text in the text-to-speech queue for the bot to read.
 * @param message String to be read out loud by the bot.
 */
function addTTS(message){
	ttsQueue.push(message);
	if(ttsQueue.length === 1){
		ttsReader();
	}
}

/* 
 * Replaces character in a certain index in a string.
 * @param str Original string
 * @param index Index of string to replace character.
 * @param chr Character to be replaced in the index.
 */
function setCharAt(str, index, chr) {
    if(index > str.length-1) return str;
    return str.substring(0, index) + chr + str.substring(index + 1);
}

/*
 * Saves the savedData object into a text file to load up next time.
 */
function save() {
	fs.writeFile('saved-data.json', JSON.stringify(savedData), (err) => {
		if (err){
			console.log("saved-data.json save failed.");
		} 
	});
}

/*
 * List of parameters for the Twitch Bot.
 * The important ones are username, password, and channels.
 * @enum username Username of the Twitch Bot.
 * @enum password Password in the form of oauth:xxxxx.
 * Just replace the oauth:xxxxx part of the above with whatever your token is.
 * @enum channels List of channels you want the bot to be in when it goes live.
 */
const options = {
	options: {
		debug: true,
	},
	connection: {
		cluster: 'aws',
		reconnect: true,
	},
	identity: {
		username: 'USERNAME-HERE',
		password: 'oauth:PASSWORD-HERE',
	},
	channels: ['CHANNEL-HERE'],
};

/*
 * Connects this bot with Twitch.
 */
const client = new tmi.client(options);
client.connect();

/*
 * Event for when a viewer of @channel subscribes. 
 * The text-to-speech reads out a subscription message.
 * @param channel Current channel the bot is live on.
 * @param username User name of subscriber.
 * @param methods Details about the susbcription including tier, prime, etc.
 * @param message Subscription message.
 * @param userstate Object about the user.
 */
client.on("subscription", (channel, username, methods, message, userstate) => {
	const { prime, plan, planName } = methods;
    let msg = `${username} subscribed`;
    if(prime) {
		msg += ` with Twitch Prime! `;
	} else {
		msg += ` with a ${tierList[plan]} sub! `;
	}
	if(message) msg += `${message}`;
    addTTS(msg);
});

/*
 * Event for when a viewer of @channel re-subscribes. 
 * The text-to-speech reads out a re-subscription message.
 * @param channel Current channel the bot is live on.
 * @param username User name of subscriber.
 * @param months Months the user has subscribed for.
 * @param methods Details about the susbcription including tier, prime, etc.
 * @param message Re-subscription message.
 * @param userstate Object about the user.
 */
client.on('resub', (channel, username, months, message, userstate, methods) => {
    const { prime, plan, planName } = methods;
    let msg = `${username} resubscribed`;
	if(months !== 0) msg += ` for ${months} months`;
    if(prime) {
		msg += ` with Twitch Prime! `;
	} else {
		msg += ` with a ${tierList[plan]} sub! `;
	}
	if(message) msg += `${message}`;
    addTTS(msg);
});

/*
 * Event for when a viewer of @channel cheers bits. 
 * The text-to-speech reads out how many bits and a message if applicable.
 * @param channel Current channel the bot is live on.
 * @param message Bit message.
 * @param userstate Object about the user. "bits" includes the number of bits.
 */
client.on("cheer", (channel, userstate, message) => {
	let msg = `${userstate["display-name"]} cheered ${userstate["bits"]}`;
	if(userstate["bits"] === 1) {
		msg += ` bit! `;
	} else {
		msg += ` bits! `;
	}
	if(message) msg += `${message}`;
	addTTS(msg);
});

/*
 * Event for when a the @channel gets raided. 
 * The text-to-speech reads out a raid message along with the number of viewers.
 * @param channel Current channel the bot is live on.
 * @param username The channel who raided.
 * @param viewers Number of viewers who are raiding.
 */
client.on("raided", (channel, username, viewers) => {
	let msg = `${username} is raiding with ${viewers} viewers!`;
	addTTS(msg);
});

/*
 * Event for when @username gifts sub(s) to @channel.
 * The text-to-speech reads out a gift subscription mesage.
 * @param channel Current channel the bot is live on.
 * @param username User name of subscriber.
 * @param months Months the user has subscribed for.
 * @param recipient Person receiving the gift sub.
 * @param methods Details about the susbcription including tier, prime, etc.
 * @param userstate Object about the user.
 */
client.on("subgift", (channel, username, months, recipient, methods, userstate) => {
	const { prime, plan, planName } = methods;
	let msg = `${username} gifted a ${tierList[plan]} sub to ${recipient}! `;
	if(months !== 0) 
		msg += `${recipient} resubscribed for ${months} months!`;
	addTTS(msg);
});

/*
 * Event for when @username gifts many gift subs to a channel.
 * The text-to-speech reads out a number of gift subscription mesage.
 * @param channel Current channel the bot is live on.
 * @param username User name of subscriber.
 * @param numbOfSubs Number of subs the @username has given.
 * @param methods Details about the susbcription including tier, prime, etc.
 * @param userstate Object about the user.
 */
client.on("submysterygift", (channel, username, numbOfSubs, methods, userstate) => {
	let msg = `${username} has just gifted the channel ${numbOfSubs} gift subscriptions!`;
	addTTS(msg);
});

/*
 * Event for when @username continues a gift subscription.
 * The text-to-speech reads out a continuation of gift sub message.
 * @param channel Current channel the bot is live on.
 * @param username User name of subscriber.
 * @param sender The user who gifted the sub to @username.
 * @param userstate Object about the user.
 */
client.on("giftpaidupgrade", (channel, username, sender, userstate) => {
    let msg = `${username} is continuing their gift sub from ${sender}! `;
	addTTS(msg);
});

/*
 * Event for when @username continues a gift subscription from an anonymous person.
 * The text-to-speech reads out a continuation of gift sub message.
 * @param channel Current channel the bot is live on.
 * @param username User name of subscriber.
 * @param userstate Object about the user.
 */
client.on("anongiftpaidupgrade", (channel, username, userstate) => {
    let msg = `${username} is continuing their gift sub from an anonymous patron! `;
	addTTS(msg);
});

/*
 * Event when the bot successfully connects to the Twitch channel.
 */
client.on('connected', (address, port) => {
	// Test to make sure TTS is working.
	addTTS(`Text to speech is working!`);
	
	// Dictionary add to list
	dictionary = fs.readFileSync('dictionary.txt').toString().split("\n");
	
	// Get previous saved data if exists. Otherwise, just start with 0.
	if(fs.existsSync('saved-data.json')) {
		let content = fs.readFileSync('saved-data.json', 'utf-8');
		try {
			savedData = JSON.parse(content);
			addTTS(`Previously save data loaded successfully.`);

		} catch (e) {
			addTTS(`The previously saved data cannot be loaded.`);
		}
	}
	else{
		addTTS(`There is no previous save data.`);
	}
});

/*
 * Event where the bot reads messages from chat.
 * @param channel Channel the bot is live on.
 * @param user Username of person who talked in chat.
 * @param message Message the user has typed.
 * @param self Data about the Twitch Bot itself.
 */
client.on('chat', (channel, user, message, self) => {
	// Simple username variable.
	const name = user["display-name"];
	
	//LURK COMMANDS START HERE!
	
	/* 
	 * Command: !lurk
	 * Permissions: Everybody.
	 * Functionality: Command used to tell the streamer a certain user 
	 * is beginning to lurk in chat. 
	 */
	if(message === '!lurk'){
		if(name in lurkers){
			client.say(channel, `@${name} is already lurking!`);
		}
		else{
			lurkers[name] = Date.now();
			client.say(channel, `@${name} is now lurking!`);
		}
	}
	
	/* 
	 * When a lurker says anything in chat after they typed !lurk, the bot tells
	 * them how long they were lurking in chat.
	 */
	if(name in lurkers && message !== '!lurk'){
		const difference = Date.now() - lurkers[name];
		delete lurkers[name];
		client.say(channel, `@${name} lurked for ${parseTime(difference)} + ".`);
	}
	
	//LURK COMMANDS END HERE!
		
	// Do not have bot read itself or non-commands.
	if(self || !message.startsWith('!')) return;
	
	// HANGMAN COMMANDS STARTS HERE!
	
	/* 
	 * Command: !start
	 * Permissions: Broadcaster and mods only.
	 * Manually starts a new Hangman game for chat to play.
	 */
	if(isBroadcasterOrMod(user) && message === '!start'){
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
			guessWord = new Array(dictionaryWord.length + 1).join('-');
			
			// Prints to console the random word slected so the broadcaster knows.
			console.log(`The word selected is: ${dictionaryWord}`);
			client.say(channel, `A Hangman game has started! Use "!guess <letter>" or "!guessword <word>" to play. Progress: ${guessWord}.`);
			started = true;
		}
	}
	
	/* 
	 * Command: !end
	 * Permissions: Broadcaster and mods only.
	 * Manually ends a game.
	 */
	if(isBroadcasterOrMod(user) && message === '!end' && started){
		started = false;
		client.say(channel, `The Hangman game has ended.`);
	}

	/* 
	 * Command: !guess <letter>
	 * Permissions: Everybody.
	 * When a Hangman game is active, this command is used to guess a letter.
	 * Command will fail if there is no Hangman game, the user is on the 30 
	 * seconds cooldown, not a a-z letter guess, or letter has been guessed.
	 */
	if(message.startsWith('!guess') && message.split(" ")[0] === "!guess"){
		let strArray = message.split(" ")
		if(!started) {
			// Game not started. 
			client.say(channel, `@${name} There is no Hangman game in progress.`);
		}  else if ((name in letterCooldown) && (letterCooldown[name] > Date.now())) {
			// User still on cooldown.
			client.say(channel, `@${name} You are on letter cooldown for ${Math.round((letterCooldown[name] - Date.now())/1000)} seconds!`);
		}  else if (strArray.length !== 2 || strArray[1].length !== 1 || !((/[a-zA-Z]/).test(strArray[1]))) {
			// Invalid guess.
			client.say(channel, `@${name} Invalid "!guess <letter>" usage. Guess one letter. Example: "!guess a"`);
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
				if(dictionaryWord.charAt(i) == charGuess) {
					guessWord = setCharAt(guessWord, i, charGuess);
					times++;
				}
			}
			
			if(times > 0) {
				// Correct guess.
				if(dictionaryWord == guessWord) {
					// Winner, so upload stats and announce win.
					savedData.wins++;
					savedData.total++;
					savedData.leaderboard[name] = (savedData.leaderboard[name]+1) || 1 ;
					save();
					started = false;
					client.say(channel, `@${name} You win! Word is "${dictionaryWord}". ${savedData.wins}/${savedData.total} wins.`);
				} else {
					//Correct, but more letters to be guessed.
					client.say(channel, `@${name} ${times} "${charGuess}". Lives: ${lives}. Guessed: ${letterGuess.join(', ')}. Progress: ${guessWord}.`);
				}
				
			} else {
				// Incorrect guess.
				lives--;
				
				if(lives === 0){
					// Game over
					savedData.total++;
					save();
					started = false;
					client.say(channel, `@${name} GAME OVER. No "${charGuess}". Guessed: ${letterGuess.join(', ')}. Final progress: ${guessWord}. Actual Word: "${dictionaryWord}". ${savedData.wins}/${savedData.total} wins.`);
				} else {
					// Incorrect, but there are still lives remaining.
					client.say(channel, `@${name} No "${charGuess}". Lives: ${lives}. Guessed: ${letterGuess.join(', ')}. Progress: ${guessWord}.`);
				}
			}
		}
	}

	/* 
	 * Command: !guessword <word>
	 * Permissions: Everybody.
	 * When a Hangman game is active, this command is used to guess the word.
	 */
	if(message.startsWith('!guessword') && message.split(" ")[0] === "!guessword"){
		let strArray = message.split(" ")
		if(!started) {
			// Game not started. 
			client.say(channel, `There is no Hangman game in progress.`);
		}  else if ((name in wordCooldown) && (wordCooldown[name] > Date.now())) {
			// User on word cooldown.
			client.say(channel, `@${name} You are on word cooldown for ${Math.round((wordCooldown[name] - Date.now())/1000)} seconds!`);
		}  else if (strArray.length !== 2) {
			//Invalid guess
			client.say(channel, `Invalid "!guessword <word>" usage. Guess a word. Example: "!guessword salmon"`);
		} else {
			// Add word cooldown.
			if(wordCooldown[name]) {
				delete wordCooldown[name];
			}
			wordCooldown[name] = Date.now() + wordCooldownTime;
			
			let wordGuess = strArray[1].toUpperCase();
			if(dictionaryWord == wordGuess){
				// Correct word guess, so game is recorded.
				savedData.wins++;
				savedData.total++;
				savedData.leaderboard[name] = (savedData.leaderboard[name]+1) || 1 ;
				save();
				started = false;
				client.say(channel, `@${name} You win! Word is "${dictionaryWord}". ${savedData.wins}/${savedData.total} wins!`);
			} else {
				// Word guess was incorrect.
				lives--;
				
				if(lives === 0){
					// Game over.
					savedData.total++;
					save();
					
					started = false;
					client.say(channel, `@${name} GAME OVER. No "${wordGuess}". Guessed: ${letterGuess.join(', ')}. Final progress: ${guessWord}. Actual word: "${dictionaryWord}". ${savedData.wins}/${savedData.total} wins`);
				} else {
					// More lives, so game not over yet but incorrect word guess.
					client.say(channel, `@${name} No "${wordGuess}". Lives: ${lives}. Guessed: ${letterGuess.join(', ')}. Progress: ${guessWord}.`);
				}
			}
		}
	}
	
	/* 
	 * Command: !leaderboard
	 * Permissions: Everybody.
	 * Get the top 10 players on the Hangman leaderboard.
	 */
	if(message === '!leaderboard'){
		let result = Object.keys(savedData.leaderboard)
			.map(key => ({id: String(key), val: savedData.leaderboard[key]}));
		let masterList = result.sort(function (a, b) {
			return b.val - a.val;
		});
		masterList = masterList.splice(0, 10);
		let leaderboard = masterList.map(function(el) {
			return el.id + ": " + el.val;
		});
		leaderboard = leaderboard.toString().replace(/,/g, ', ');
		client.say(channel, `Top 10 Hangman players: ${leaderboard}`);
	}
	
	/* 
	 * Command: !savedData
	 * Permissions: Everybody.
	 * Find out your own stats on the Hangman leaderboard.
	 */
	if(message === '!stats') {
		let val = 0;
		if(name in savedData.leaderboard){
			val = savedData.leaderboard[name];
		}
		client.say(channel, `@${name} has won ${val} Hangman games!`);
	}
	// HANGMAN COMMANDS ENDS HERE!
	
	
	// TTS COMMANDS STARTS HERE!
	
	/* 
	 * Command: !tts
	 * Permissions: Broadcasters, mods, VIPs, subs (unless you are banned.)
	 * Lets a text-to-speech reader read your message out loud.
	 */
	if(message.startsWith("!tts") && message.split(" ")[0] === "!tts"){
		console.log(name);
		console.log(JSON.stringify(savedData))
		if(message === "!tts"){
			// No message, so instructions on how to use.
			client.say(channel, `@${name} Add a message after typing the !tts command to have a text-to-speech reader read your message. Example: !tts Hello World!`)
		}
		else if(!ttsOn){
			// TTS is off so a message is said to tell that.
			client.say(channel, `@${name} Text to speech is off.`)
		}
		else if((savedData.ttsBanList).includes(name)){
			// Banned people not allowed.
			client.say(channel, `@${name} You are banned from using TTS.`);
		}
		else if(!(isBroadcasterOrMod(user) || isSubOrVIP(user)))
		{
			// TTS does not work for people without the right permissions.
			client.say(channel, `@${name} Only subs and VIPs can use TTS.`);
		}
		else {
			// Add the TTS to the queue.
			const toSay = message.substr(message.indexOf(" ") + 1);
			if(ttsQueue.length != 0){
				ttsQueue.push(`${name} says: ${toSay}`);
			}
			else{
				ttsQueue.push(`${name} says: ${toSay}`);
				ttsReader();
			}
		}
	}
	
	/* 
	 * Command: !skip
	 * Permissions: Broadcasters or mods.
	 * Skips the current TTS message to the next one.
	 */
	if(message === "skip" && isBroadcasterOrMod(user)){
		say.stop();		
	}
	
	/* 
	 * Command: !ban
	 * Permissions: Broadcasters or mods.
	 * Bans a user from using text-to-speech.
	 */
	if(isBroadcasterOrMod(user) && message.startsWith("!ban")){
		if(message === "!ban" || message.split(" ").length != 2){
			client.say(channel, `TTS Ban Failed. Example: !ban @${name}`)
		}
		else{
			//Get user to ban in input variable, get rid of @ if there
			let input = message.split(' ')[1];
			if(input.charAt(0) == '@'){
				input = input.substring(1);
			}
			
			if((savedData.ttsBanList).includes(input)){
				client.say(channel, `@${input} is already banned!`);
			}
			else{
				(savedData.ttsBanList).push(input);
				save();
				client.say(channel, `@${input} is now banned from TTS!`);
			}
		}
	}
	
	/* 
	 * Command: !unban
	 * Permissions: Broadcasters or mods.
	 * Unbans a user from using text-to-speech.
	 */
	if(isBroadcasterOrMod(user) && message.startsWith("!unban")){
		if(message === "!unban"  || message.split(" ").length != 2){
			client.say(channel, `TTS Ban Failed. Example: !unban @${name}`)
		}
		else{
			let input = message.split(' ')[1];
			if(input.charAt(0) == '@'){
				input = input.substring(1);
			}
			if((savedData.ttsBanList).includes(input)){
				savedData.ttsBanList = (savedData.ttsBanList).filter(e => e !== input); 
				save();
				client.say(channel, `@${input} is unbanned from TTS!`);
			}
			else{
				client.say(channel, `@${input} was not banned!`);
			}
		}
	}
	
	/* 
	 * Command: !off
	 * Permissions: Broadcasters or mods.
	 * Turns off TTS.
	 */
	if(isBroadcasterOrMod(user) && message === "!off"){
		if(ttsOn){
			ttsOn = false;	
			if(ttsQueue.length > 0){
				ttsQueue.length = 0;
				say.stop();
			}
			client.say(channel, `TTS is turned off.`);
		}
		else{
			client.say(channel, `TTS is already turned off.`);
		}
	}
	
	/* 
	 * Command: !on
	 * Permissions: Broadcasters or mods.
	 * Turns on TTS.
	 */
	if(isBroadcasterOrMod(user) && message === "!on"){
		if(ttsOn){			
			client.say(channel, `TTS is already on.`);
		}
		else{
			ttsOn = true;
			client.say(channel, `TTS is turned off.`);
		}
	}
	
	/* 
	 * Command: !clear
	 * Permissions: Broadcasters or mods.
	 * Removes all TTS currently waiting in the queue.
	 */
	if(isBroadcasterOrMod(user) && message === "!clear"){
		if(ttsQueue.length > 0){
			ttsQueue.length = 0;
			say.stop();
		}
	}
	
	// TTS COMMANDS ENDS HERE!
});

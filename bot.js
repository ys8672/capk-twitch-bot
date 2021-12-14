// Imports
const fs = require('fs');
const { commands } = require('./utils/constants');
const { client } = require('./utils/index');

const {
	dataPath,
	updateSavedData
} = require('./data/index');

const {
	tierList,
	addTTS,
	clearTTS,
	disableTTS,
	enableTTS,
	isTTS,
	skipTTS,
	tts,
} = require('./commands/tts');

const {
	lurk,
	showLurkDuration
} = require('./commands/lurk');

const hangman = require('./commands/hangman');
const {
	banUserFromTTS,
	isBan,
	isUnban,
	unbanUserFromTTS
} = require('./commands/ban');


/* Connect bot to Twitch */
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
	hangman.loadDictionary();
	
	// Get previous saved data if exists. Otherwise, just start with 0.
	if(fs.existsSync(dataPath)) {
		let content = fs.readFileSync(dataPath, 'utf-8');
		try {
			updateSavedData(JSON.parse(content));
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

	// Shared Props
	const sharedProps = { channel, client };

	// Lurk Props
	const lurkProps = { ...sharedProps, name };

	// Lurk needs to be before the self/command check. 
	if(message === commands.LURK) {
		lurk(lurkProps);
	} else {
		/* Show time lurking, if chatter is lurking */
		showLurkDuration(lurkProps);
	}

	// Do not have bot read itself or non-commands.
	if(self || !message.startsWith('!')) return;

	// Ban props
	const banProps = { ...sharedProps, message, name, user };

	// Hangman Props
	const hangmanProps = { ...sharedProps, name, user };

	// TTS Props
	const ttsProps = { ...sharedProps, user }

	/* Dictionary list of explicit commands */
	const chatCommands = {
		[commands.BAN]: () => banUserFromTTS(banProps),
		[commands.END]: () => hangman.end(hangmanProps),
		[commands.CLEAR]: () => clearTTS({ user }),
		[commands.GUESS]: () => hangman.guessLetter({ ...hangmanProps, message }),
		[commands.GUESS_WORD]: () => hangman.guessWord({ ...hangmanProps, message }),
		[commands.LEADERBOARD]: () => hangman.leaderBoard(hangmanProps),
		[commands.OFF]: () => disableTTS(ttsProps),
		[commands.ON]: () => enableTTS(ttsProps),
		[commands.SKIP]: () => skipTTS({ user }),
		[commands.START]: () => hangman.start(hangmanProps),
		[commands.STATS]: () => hangman.stats(hangmanProps),
		[commands.TTS]: () => tts({ ...ttsProps, message, name }),
		[commands.UNBAN]: () => unbanUserFromTTS(banProps),
	};



	/* Execute specific !command */
	let command;
	switch(true){
		case (isBan(message)):
			command = '!ban';
			break;
		case (isUnban(message)):
			command = '!unban';
			break;
		case (hangman.isGuess(message)):
			command = '!guess';
			break;
		case (hangman.isGuessWord(message)):
			command = '!guessword';
			break;
		case (isTTS(message)):
			command = '!tts';
			break;
		default:
			command = message;
			break;
	}

	/* Node versions < v14 do not support optional chaining (null safe operator) */
	if(chatCommands[command]) {
		chatCommands[command]();
	}
});

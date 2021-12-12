const say = require('say');
const { commands } = require('../utils/constants');
const { isBroadcasterOrMod, isSubOrVIP } = require('../utils/index');
const { getSavedData } = require('../data/index');

// TEXT-TO-SPEECH VARIABLES
/* Speed the text-to-speech reads the message. 1.0 is normal, 0.5 is half
	speed, and 2.0 is 2x speed. */
const ttsSpeed = 1.0;
/* Sub tier mapped from tmi API response to normal English words.*/
const tierList = { "1000": "Tier 1", "2000": "Tier 2", "3000": "Tier 3" };

/* TEXT-TO-SPEECH is on or off. */
let ttsOn = true;

const isTTS = (message) => message.startsWith("!tts") && message.split(" ")[0] === "!tts";

/**
 * @param {Boolean} val
 * let variables can only be modified inside the module.  The exports are readonly, similar to constants
 */
const toggleTTS = (val) => { ttsOn = val; }

/* List of messages the TTS will read in order. */
const ttsQueue = [];

/*
 * Reads the first text-to-speech message in the ttsQueue, then continues until
 * all messages have been read out loud.
 */
function ttsReader(){
    say.speak(ttsQueue[0], null, ttsSpeed, (err) => {
        ttsQueue.shift()
        if(ttsQueue.length > 0){
            ttsReader();
        }
    });
}

/**
 * Adds a text in the text-to-speech queue for the bot to read.
 * @param {String} message
 */
function addTTS(message){
    ttsQueue.push(message);
    if(ttsQueue.length === 1){
        ttsReader();
    }
}

/**
 * Command: !clear
 * Permissions: Broadcasters or mods.
 * Removes all TTS currently waiting in the queue.
 * @param user
 */
function clearTTS({ user }){
    if(isBroadcasterOrMod(user)){
        if(ttsQueue.length > 0){
            ttsQueue.length = 0;
            say.stop();
        }
    }
}

/**
 * Command: !off
 * Permissions: Broadcasters or mods.
 * Turns off TTS
 * @param channel
 * @param client
 * @param user
 */
function disableTTS({ channel, client, user }){
    if(isBroadcasterOrMod(user)){
        if(ttsOn){
            toggleTTS(false);
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
}

/**
 * Command: !on
 * Permissions: Broadcasters or mods.
 * Turns on TTS
 * @param channel
 * @param client
 * @param user
 */
function enableTTS({ channel, client, user }){
    if(isBroadcasterOrMod(user)){
        if(ttsOn){
            client.say(channel, `TTS is already on.`);
        } else {
            toggleTTS(true);
            client.say(channel, `TTS is turned on.`);
        }
    }
}

/**
 * Command: !skip
 * Permissions: Broadcasters or mods.
 * Skips the current TTS message to the next one.
 * @param user
 */
function skipTTS({ user }){
    if(isBroadcasterOrMod(user)){
        say.stop();
    }
}

function tts({ channel, client, message, name, user }){
    /*
	 * Command: !tts
	 * Permissions: Broadcasters, mods, VIPs, subs (unless you are banned.)
	 * Lets a text-to-speech reader read your message out loud.
	 */
    const messages = {
        banned: `@${name} You are banned from using TTS.`,
        instructions: [
                `@${name} Add a message after typing the !tts command to have a text-to-speech reader read your message.`,
                `Example: ${commands.TTS} Hello World!`
            ].join(' '),
        off: `@${name} Text to speech is off.`,
        subOrVip: `@${name} Only subs and VIPs can use TTS.`,

    };

    if(message === "!tts"){
        // No message, so instructions on how to use.
        client.say(channel, messages.instructions);
    } else if(!ttsOn) {
        // TTS is off so a message is said to tell that.
        client.say(channel, messages.off)
    } else if((getSavedData().ttsBanList).includes(name)) {
        // Banned people not allowed.
        client.say(channel, messages.banned);
    } else if(!(isBroadcasterOrMod(user) || isSubOrVIP(user))) {
        // TTS does not work for people without the right permissions.
        client.say(channel, messages.subOrVip);
    } else {
        // Add the TTS to the queue.
        const toSay = message.substr(message.indexOf(" ") + 1);

        if(ttsQueue.length !== 0){
            ttsQueue.push(`${name} says: ${toSay}`);
        } else {
            ttsQueue.push(`${name} says: ${toSay}`);
            ttsReader();
        }
    }
}


module.exports = {
    ttsSpeed,
    tierList,
    ttsOn,
    toggleTTS,
    ttsQueue,
    ttsReader,
    addTTS,
    clearTTS,
    disableTTS,
    enableTTS,
    isTTS,
    skipTTS,
    tts,
}
const tmi = require('tmi.js');
const { options } = require('../botOptions');
/*
 * Connects this bot with Twitch.
 */
exports.client = new tmi.client(options);

/*
 * Checks if user is either the broadcaster or a moderator.
 * @param user Object with all information about the user.
 */
exports.isBroadcasterOrMod = (user) => {
    return 'broadcaster' in user.badges
        || 'mod' in user.badges;
};

/*
 * Checks if user is either a VIP or subscriber.
 * @param user Object with all information about the user.
 */
exports.isSubOrVIP = (user) => {
    return 'subscriber' in user.badges
        || 'founder' in user.badges
        || 'vip' in user.badges;
};

/*
 * Converts number from milliseconds to readable time.
 * @param milliseconds Milliseconds to convert (1 ms = 1000s).
 */
exports.parseTime = (milliseconds) => {
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
};

/*
 * Replaces character in a certain index in a string.
 * @param str Original string
 * @param index Index of string to replace character.
 * @param chr Character to be replaced in the index.
 */
exports.setCharAt = (str, index, chr) => {
    if(index > str.length-1) return str;
    return str.substring(0, index) + chr + str.substring(index + 1);
}
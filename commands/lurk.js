const { parseTime } = require('../utils/index');

// LURK COMMAND VARIABLES
/* Object of lurkers and the time they started lurking.*/
const lurkers = {};
const isLurking = (name) => (name in lurkers);
/*
	 * Command: !lurk
	 * Permissions: Everybody.
	 * Functionality: Command used to tell the streamer a certain user
	 * is beginning to lurk in chat.
	 */
const lurk = ({channel, client, name}) => {
    if(isLurking){
        client.say(channel, `@${name} is already lurking!`);
    } else {
        lurkers[name] = Date.now();
        client.say(channel, `@${name} is now lurking!`);
    }
};

/*
	 * When a lurker says anything in chat after they typed !lurk, the bot tells
	 * them how long they were lurking in chat.
	 */
const showLurkDuration = ({channel, client, name}) => {
    if(isLurking(name)){
        const difference = Date.now() - lurkers[name];
        delete lurkers[name];
        client.say(channel, `@${name} lurked for ${parseTime(difference)} + ".`);
    }
};

module.exports = {
    lurk,
    lurkers,
    showLurkDuration
};
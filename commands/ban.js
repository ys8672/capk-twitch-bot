const { isBroadcasterOrMod } = require('../utils/index.js');
const { commands } = require('../utils/constants');
const { save, savedData } = require('../data/index');

const isBan = message => message.startsWith("!ban");
const isUnban = message => message.startsWith("!unban");

/**
 * Command: !ban
 * Permissions: Broadcasters or mods.
 * Bans a user from using text-to-speech.
 * @param channel
 * @param client
 * @param message
 * @param name
 * @param user
 */
const banUserFromTTS = ({ channel, client, message, name, user }) => {
    /* Guard */
    if(!(isBroadcasterOrMod(user) && isBan(message))){
        return;
    }

    if(message === commands.BAN || message.split(" ").length !== 2){
        client.say(channel, `TTS Ban Failed. Example: !ban @${name}`)
    } else {
        //Get user to ban in input variable, get rid of @ if there
        let input = message.split(' ');

        if(input[1]) {
            input = input[1].replace(/^@/, '');
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
};

/**
 * Command: !unban
 * Permissions: Broadcasters or mods.
 * Unbans a user from using text-to-speech.
 * @param channel
 * @param client
 * @param message
 * @param name
 * @param user
 */
const unbanUserFromTTS = ({ channel, client, message, name, user }) => {
    /* Guard */
    if(!(isBroadcasterOrMod(user) && isUnban(message))){
        return;
    }

    if(isBroadcasterOrMod(user) && message.startsWith("!unban")){

        if(message === commands.UNBAN  || message.split(" ").length !== 2){
            client.say(channel, `TTS Ban Failed. Example: !unban @${name}`)
        } else {
            let input = message.split(' ');

            if(input[1]) {
                input = input[1].replace(/^@/, '');
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
};

module.exports = {
    banUserFromTTS,
    isBan,
    isUnban,
    unbanUserFromTTS
};
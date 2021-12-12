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
        username: 'USERNAME-HERE'
        password: 'oauth:PASSWORD-HERE'
    },
    channels: ['CHANNEL-HERE'],
};

module.exports = { options }